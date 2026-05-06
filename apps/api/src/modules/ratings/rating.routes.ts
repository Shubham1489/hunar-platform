/**
 * Rating Routes — Submit, List, Report.
 */
import { FastifyInstance } from 'fastify';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../middleware/authenticate';
import { sendSuccess } from '../../utils/response';

export async function ratingRoutes(app: FastifyInstance): Promise<void> {
  /** GET /ratings/worker/:workerId */
  app.get('/worker/:workerId', async (request, reply) => {
    const { workerId } = request.params as { workerId: string };
    const ratings = await prisma.rating.findMany({
      where: { rateeId: workerId, isReported: false },
      include: { rater: { select: { name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(reply, request, ratings);
  });

  /** PUT /ratings/:id/report */
  app.put('/:id/report', { preHandler: [authenticate] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.rating.update({ where: { id }, data: { isReported: true } });
    return sendSuccess(reply, request, { message: 'Review reported for admin review' });
  });
}
