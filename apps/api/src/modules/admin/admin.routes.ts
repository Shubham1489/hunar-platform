/**
 * Admin Routes — User management, disputes, analytics.
 */
import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { sendSuccess } from '../../utils/response';

export async function adminRoutes(app: FastifyInstance): Promise<void> {
  const adminAuth = [authenticate, authorize('ADMIN')];

  /** GET /admin/users */
  app.get('/users', { preHandler: adminAuth }, async (request, reply) => {
    const { role, status, search, limit = '50', cursor } = request.query as any;
    const where: any = {};
    if (role) where.role = role;
    if (status === 'active') where.isActive = true;
    if (status === 'suspended') where.isActive = false;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: { id: true, name: true, phone: true, role: true, isActive: true, isVerified: true, avatarUrl: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
    return sendSuccess(reply, request, users);
  });

  /** PUT /admin/users/:id/status */
  app.put('/users/:id/status', { preHandler: adminAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { isActive } = request.body as { isActive: boolean };
    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
    });
    return sendSuccess(reply, request, user);
  });

  /** GET /admin/disputes */
  app.get('/disputes', { preHandler: adminAuth }, async (request, reply) => {
    const disputes = await prisma.booking.findMany({
      where: { status: 'DISPUTED' },
      include: {
        customer: { include: { user: { select: { name: true, phone: true } } } },
        worker: { include: { user: { select: { name: true, phone: true } } } },
        serviceRequest: true,
        payment: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return sendSuccess(reply, request, disputes);
  });

  /** PUT /admin/disputes/:id/resolve */
  app.put('/disputes/:id/resolve', { preHandler: adminAuth }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { action } = request.body as { action: 'release' | 'refund' | 'split' };

    await prisma.booking.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });

    if (action === 'refund') {
      await prisma.payment.updateMany({ where: { bookingId: id }, data: { status: 'REFUNDED' } });
    } else {
      await prisma.payment.updateMany({ where: { bookingId: id }, data: { status: 'RELEASED' } });
    }

    return sendSuccess(reply, request, { message: `Dispute resolved: ${action}` });
  });

  /** GET /admin/analytics */
  app.get('/analytics', { preHandler: adminAuth }, async (request, reply) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalUsers, totalWorkers, totalEmployers, totalCustomers, totalJobs, activeJobs, totalBookings, completedBookings, totalRevenue] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'WORKER' } }),
      prisma.user.count({ where: { role: 'EMPLOYER' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.jobPosting.count(),
      prisma.jobPosting.count({ where: { status: 'OPEN' } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.payment.aggregate({ where: { status: 'RELEASED' }, _sum: { platformFee: true } }),
    ]);

    return sendSuccess(reply, request, {
      totalUsers, totalWorkers, totalEmployers, totalCustomers,
      totalJobs, activeJobs, totalBookings, completedBookings,
      totalRevenue: Number(totalRevenue._sum.platformFee || 0),
    });
  });

  /** GET /admin/analytics/export */
  app.get('/analytics/export', { preHandler: adminAuth }, async (request, reply) => {
    // CSV export of key metrics
    const users = await prisma.user.findMany({
      select: { id: true, name: true, phone: true, role: true, isActive: true, createdAt: true },
    });
    const csv = ['id,name,phone,role,active,created_at', ...users.map(u =>
      `${u.id},${u.name || ''},${u.phone},${u.role},${u.isActive},${u.createdAt.toISOString()}`
    )].join('\n');

    reply.header('Content-Type', 'text/csv');
    reply.header('Content-Disposition', 'attachment; filename=hunar_users_export.csv');
    return reply.send(csv);
  });
}
