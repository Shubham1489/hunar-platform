/**
 * Notification Routes
 */
import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../middleware/authenticate';
import { sendSuccess } from '../../utils/response';

export async function notificationRoutes(app: FastifyInstance): Promise<void> {
  /** GET /notifications */
  app.get('/', { preHandler: [authenticate] }, async (request, reply) => {
    const notifications = await prisma.notification.findMany({
      where: { userId: request.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    const unreadCount = await prisma.notification.count({
      where: { userId: request.userId, isRead: false },
    });
    return sendSuccess(reply, request, { notifications, unreadCount });
  });

  /** PUT /notifications/:id/read */
  app.put('/:id/read', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.notification.update({ where: { id }, data: { isRead: true } });
    return sendSuccess(reply, request, { message: 'Marked as read' });
  });

  /** PUT /notifications/read-all */
  app.put('/read-all', { preHandler: [authenticate] }, async (request, reply) => {
    await prisma.notification.updateMany({
      where: { userId: request.userId, isRead: false },
      data: { isRead: true },
    });
    return sendSuccess(reply, request, { message: 'All marked as read' });
  });
}
