/**
 * Customer Routes — Service Requests, Worker Search, Bookings, Payments, Ratings.
 */
import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { createServiceRequestSchema, createBookingSchema, workerSearchSchema } from '@hunar/shared';
import { submitRatingSchema } from '@hunar/shared';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { ErrorCodes } from '@hunar/shared';

export async function customerRoutes(app: FastifyInstance): Promise<void> {
  /** GET /customers/me */
  app.get('/me', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const profile = await prisma.customerProfile.findUnique({
      where: { id: request.userId },
      include: { user: { select: { id: true, name: true, phone: true, avatarUrl: true } } },
    });
    return sendSuccess(reply, request, profile);
  });

  /** PUT /customers/me */
  app.put('/me', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const { name, defaultCity, defaultLat, defaultLng } = request.body as any;
    if (name) await prisma.user.update({ where: { id: request.userId }, data: { name } });
    const profile = await prisma.customerProfile.update({
      where: { id: request.userId },
      data: { defaultCity, defaultLat, defaultLng },
    });
    return sendSuccess(reply, request, profile);
  });

  /** POST /customers/service-requests */
  app.post('/service-requests', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const data = createServiceRequestSchema.parse(request.body);
    const sr = await prisma.serviceRequest.create({
      data: { ...data, customerId: request.userId } as any,
    });
    return sendSuccess(reply, request, sr, 201);
  });

  /** GET /customers/service-requests/:id/workers — Matched workers for a request */
  app.get('/service-requests/:id/workers', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const sr = await prisma.serviceRequest.findUnique({ where: { id } });
    if (!sr) throw new AppError(ErrorCodes.NOT_FOUND, 'Service request not found', 404);

    const workers = await prisma.workerProfile.findMany({
      where: {
        isAvailable: true,
        skills: { some: { skill: { nameEn: { contains: sr.serviceType, mode: 'insensitive' } } } },
      },
      include: {
        user: { select: { name: true, avatarUrl: true, phone: true } },
        skills: { include: { skill: true }, take: 5 },
      },
      orderBy: { ratingAvg: 'desc' },
      take: 20,
    });
    return sendSuccess(reply, request, workers);
  });

  /** GET /customers/workers — Search workers by service + location */
  app.get('/workers', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const query = workerSearchSchema.parse(request.query);
    const where: any = { isAvailable: true };
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.serviceType) {
      where.skills = { some: { skill: { OR: [
        { nameEn: { contains: query.serviceType, mode: 'insensitive' } },
        { category: { contains: query.serviceType, mode: 'insensitive' } },
      ]}}};
    }
    if (query.minRating) where.ratingAvg = { gte: query.minRating };

    const orderBy: any = query.sortBy === 'price' ? { dailyRate: 'asc' }
      : query.sortBy === 'distance' ? { city: 'asc' }
      : { ratingAvg: 'desc' };

    const workers = await prisma.workerProfile.findMany({
      where,
      include: {
        user: { select: { name: true, avatarUrl: true } },
        skills: { include: { skill: true }, take: 5 },
      },
      orderBy,
      take: query.limit!,
    });
    return sendSuccess(reply, request, workers);
  });

  /** POST /customers/bookings — Create booking */
  app.post('/bookings', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const data = createBookingSchema.parse(request.body);
    const commissionRate = parseFloat(process.env.PLATFORM_COMMISSION_RATE || '0.10');
    const platformFee = data.totalAmount * commissionRate;

    const booking = await prisma.booking.create({
      data: {
        serviceRequestId: data.serviceRequestId,
        customerId: request.userId,
        workerId: data.workerId,
        totalAmount: data.totalAmount,
        platformFee,
        status: 'CONFIRMED',
        confirmedAt: new Date(),
      },
      include: { worker: { include: { user: { select: { name: true } } } } },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        referenceType: 'BOOKING',
        referenceId: booking.id,
        payerId: request.userId,
        payeeId: data.workerId,
        amount: data.totalAmount,
        platformFee,
        method: data.paymentMethod as any,
        status: data.paymentMethod === 'CASH' ? 'RELEASED' : 'HELD',
      },
    });

    // Update service request status
    await prisma.serviceRequest.update({
      where: { id: data.serviceRequestId },
      data: { status: 'BOOKED' },
    });

    return sendSuccess(reply, request, booking, 201);
  });

  /** GET /customers/bookings */
  app.get('/bookings', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const bookings = await prisma.booking.findMany({
      where: { customerId: request.userId },
      include: {
        serviceRequest: true,
        worker: { include: { user: { select: { name: true, avatarUrl: true, phone: true } }, skills: { include: { skill: true }, take: 3 } } },
        rating: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(reply, request, bookings);
  });

  /** GET /customers/bookings/:id */
  app.get('/bookings/:id', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const booking = await prisma.booking.findFirst({
      where: { id, customerId: request.userId },
      include: { serviceRequest: true, worker: { include: { user: true, skills: { include: { skill: true } } } }, payment: true, rating: true },
    });
    if (!booking) throw new AppError(ErrorCodes.NOT_FOUND, 'Booking not found', 404);
    return sendSuccess(reply, request, booking);
  });

  /** POST /customers/bookings/:id/complete — Generate OTP for completion */
  app.post('/bookings/:id/complete', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const booking = await prisma.booking.findFirst({
      where: { id, customerId: request.userId, status: { in: ['CONFIRMED', 'IN_PROGRESS'] } },
    });
    if (!booking) throw new AppError(ErrorCodes.NOT_FOUND, 'Active booking not found', 404);

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.booking.update({
      where: { id },
      data: { otpCode: hashedOtp, otpExpiresAt: otpExpiry, status: 'IN_PROGRESS' },
    });

    console.log(`🔑 Booking completion OTP for booking ${id}: ${otp}`);
    return sendSuccess(reply, request, { otp, expiresAt: otpExpiry });
  });

  /** POST /customers/bookings/:id/dispute */
  app.post('/bookings/:id/dispute', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.booking.update({
      where: { id, customerId: request.userId },
      data: { status: 'DISPUTED' },
    });
    return sendSuccess(reply, request, { message: 'Dispute raised. Admin will review.' });
  });

  /** POST /customers/bookings/:id/rate — Rate and review */
  app.post('/bookings/:id/rate', { preHandler: [authenticate, authorize('CUSTOMER')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { score, review } = submitRatingSchema.parse({ ...(request.body as any), bookingId: id });
    
    const booking = await prisma.booking.findFirst({
      where: { id, customerId: request.userId, status: 'COMPLETED' },
    });
    if (!booking) throw new AppError(ErrorCodes.NOT_FOUND, 'Completed booking not found', 404);

    const rating = await prisma.rating.create({
      data: {
        bookingId: id,
        raterId: request.userId,
        rateeId: booking.workerId,
        score,
        review,
      },
    });

    // Recalculate worker rating
    const avgResult = await prisma.rating.aggregate({
      where: { rateeId: booking.workerId },
      _avg: { score: true },
      _count: { score: true },
    });

    await prisma.workerProfile.update({
      where: { id: booking.workerId },
      data: {
        ratingAvg: avgResult._avg.score || 0,
        ratingCount: avgResult._count.score || 0,
      },
    });

    return sendSuccess(reply, request, rating, 201);
  });
}
