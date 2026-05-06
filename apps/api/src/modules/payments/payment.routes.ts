/**
 * Payment Routes — Razorpay integration, escrow, webhooks.
 */
import { FastifyInstance } from 'fastify';
import crypto from 'crypto';
import { initiatePaymentSchema, verifyPaymentSchema } from '@hunar/shared';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { ErrorCodes } from '@hunar/shared';

export async function paymentRoutes(app: FastifyInstance): Promise<void> {
  /** POST /payments/initiate — Create Razorpay order */
  app.post('/initiate', { preHandler: [authenticate] }, async (request, reply) => {
    const data = initiatePaymentSchema.parse(request.body);

    // In dev mode: create mock order
    const razorpayOrderId = `order_${crypto.randomBytes(12).toString('hex')}`;

    const payment = await prisma.payment.create({
      data: {
        referenceType: 'BOOKING',
        referenceId: data.bookingId,
        bookingId: data.bookingId,
        payerId: request.userId,
        payeeId: (await prisma.booking.findUnique({ where: { id: data.bookingId } }))?.workerId || '',
        amount: data.amount,
        platformFee: data.amount * 0.10,
        method: data.method as any,
        status: 'PENDING',
        razorpayOrderId,
      },
    });

    return sendSuccess(reply, request, {
      paymentId: payment.id,
      razorpayOrderId,
      amount: data.amount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo',
    }, 201);
  });

  /** POST /payments/verify — Verify Razorpay signature */
  app.post('/verify', { preHandler: [authenticate] }, async (request, reply) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = verifyPaymentSchema.parse(request.body);

    // Verify signature (in production)
    const secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret';
    const generated = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    // In dev mode, accept any signature
    if (process.env.NODE_ENV === 'production' && generated !== razorpaySignature) {
      throw new AppError(ErrorCodes.PAYMENT_FAILED, 'Payment verification failed', 400);
    }

    const existingPayment = await prisma.payment.findFirst({
      where: { razorpayOrderId },
    });

    if (!existingPayment) {
      throw new AppError(ErrorCodes.NOT_FOUND, 'Payment not found', 404);
    }

    const payment = await prisma.payment.update({
      where: { id: existingPayment.id },
      data: { razorpayPaymentId, status: 'HELD' },
    });

    // Update booking status
    if (payment.bookingId) {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED', confirmedAt: new Date() },
      });
    }

    return sendSuccess(reply, request, { verified: true, paymentId: payment.id });
  });

  /** GET /payments/:id */
  app.get('/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new AppError(ErrorCodes.NOT_FOUND, 'Payment not found', 404);
    return sendSuccess(reply, request, payment);
  });

  /** POST /payments/:id/refund */
  app.post('/:id/refund', { preHandler: [authenticate, authorize('ADMIN')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const payment = await prisma.payment.update({
      where: { id },
      data: { status: 'REFUNDED' },
    });
    return sendSuccess(reply, request, payment);
  });

  /** POST /webhooks/razorpay — Webhook receiver */
  app.post('/webhooks/razorpay', async (request, reply) => {
    // Verify webhook signature
    const signature = request.headers['x-razorpay-signature'] as string;
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    
    if (secret) {
      const expected = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(request.body))
        .digest('hex');
      
      if (signature !== expected) {
        return reply.status(400).send({ error: 'Invalid webhook signature' });
      }
    }

    const event = request.body as any;
    console.log('Razorpay webhook:', event?.event);

    // Process webhook events
    if (event?.event === 'payment.captured') {
      const orderId = event.payload?.payment?.entity?.order_id;
      if (orderId) {
        await prisma.payment.updateMany({
          where: { razorpayOrderId: orderId },
          data: { status: 'HELD' },
        });
      }
    }

    return reply.status(200).send({ received: true });
  });
}
