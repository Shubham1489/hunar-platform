/**
 * Employer Routes — Profile, Job Management, Worker Directory, Analytics.
 */
import { FastifyInstance } from 'fastify';
import { createJobSchema, updateJobSchema, updateEmployerProfileSchema } from '@hunar/shared';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { sendSuccess, sendNoContent } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { ErrorCodes } from '@hunar/shared';

export async function employerRoutes(app: FastifyInstance): Promise<void> {
  /** GET /employers/me */
  app.get('/me', { preHandler: [authenticate, authorize('EMPLOYER')] }, async (request, reply) => {
    const profile = await prisma.employerProfile.findUnique({
      where: { id: request.userId },
      include: { user: { select: { id: true, name: true, phone: true, avatarUrl: true } } },
    });
    if (!profile) throw new AppError(ErrorCodes.NOT_FOUND, 'Employer profile not found', 404);
    return sendSuccess(reply, request, profile);
  });

  /** PUT /employers/me */
  app.put('/me', { preHandler: [authenticate, authorize('EMPLOYER')] }, async (request, reply) => {
    const data = updateEmployerProfileSchema.parse(request.body);
    const profile = await prisma.employerProfile.update({
      where: { id: request.userId },
      data,
    });
    return sendSuccess(reply, request, profile);
  });

  /** GET /employers/me/jobs */
  app.get('/me/jobs', { preHandler: [authenticate, authorize('EMPLOYER')] }, async (request, reply) => {
    const jobs = await prisma.jobPosting.findMany({
      where: { employerId: request.userId },
      include: { _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return sendSuccess(reply, request, jobs);
  });

  /** POST /employers/jobs — Create job */
  app.post('/jobs', { preHandler: [authenticate, authorize('EMPLOYER')] }, async (request, reply) => {
    const data = createJobSchema.parse(request.body);
    const job = await prisma.jobPosting.create({
      data: { ...data, employerId: request.userId } as any,
      include: { employer: { select: { companyName: true } } },
    });
    return sendSuccess(reply, request, job, 201);
  });

  /** PUT /employers/jobs/:id — Update job */
  app.put('/jobs/:id', { preHandler: [authenticate, authorize('EMPLOYER')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = updateJobSchema.parse(request.body);
    const job = await prisma.jobPosting.update({
      where: { id, employerId: request.userId },
      data: data as any,
    });
    return sendSuccess(reply, request, job);
  });

  /** DELETE /employers/jobs/:id */
  app.delete('/jobs/:id', { preHandler: [authenticate, authorize('EMPLOYER')] }, async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.jobPosting.update({
      where: { id, employerId: request.userId },
      data: { status: 'CLOSED' },
    });
    return sendNoContent(reply);
  });

  /** GET /employers/workers — Browse worker directory */
  app.get('/workers', { preHandler: [authenticate, authorize('EMPLOYER')] }, async (request, reply) => {
    const { skill, city, limit = '20', cursor } = request.query as any;
    const where: any = { isAvailable: true };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (skill) {
      where.skills = { some: { skill: { nameEn: { contains: skill, mode: 'insensitive' } } } };
    }

    const workers = await prisma.workerProfile.findMany({
      where,
      include: {
        user: { select: { name: true, avatarUrl: true } },
        skills: { include: { skill: true }, take: 5 },
      },
      orderBy: { ratingAvg: 'desc' },
      take: parseInt(limit) + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = workers.length > parseInt(limit);
    const data = hasMore ? workers.slice(0, parseInt(limit)) : workers;
    return sendSuccess(reply, request, { data, nextCursor: hasMore ? data[data.length - 1]?.id : null });
  });

  /** POST /employers/workers/:id/offer — Direct offer */
  app.post('/workers/:id/offer', { preHandler: [authenticate, authorize('EMPLOYER')] }, async (request, reply) => {
    const { id: workerId } = request.params as { id: string };
    const { jobId, message } = request.body as { jobId: string; message?: string };

    await prisma.notification.create({
      data: {
        userId: workerId,
        type: 'DIRECT_OFFER',
        title: 'You received a direct job offer!',
        body: message || 'An employer wants to hire you directly.',
        data: { jobId, employerId: request.userId },
      },
    });
    return sendSuccess(reply, request, { message: 'Offer sent' }, 201);
  });

  /** GET /employers/analytics */
  app.get('/analytics', { preHandler: [authenticate, authorize('EMPLOYER')] }, async (request, reply) => {
    const [totalJobs, activeJobs, totalApplicants, hiredThisMonth] = await Promise.all([
      prisma.jobPosting.count({ where: { employerId: request.userId } }),
      prisma.jobPosting.count({ where: { employerId: request.userId, status: 'OPEN' } }),
      prisma.jobApplication.count({
        where: { job: { employerId: request.userId } },
      }),
      prisma.jobApplication.count({
        where: {
          job: { employerId: request.userId },
          status: 'HIRED',
          updatedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      }),
    ]);
    return sendSuccess(reply, request, { totalJobs, activeJobs, totalApplicants, hiredThisMonth });
  });
}
