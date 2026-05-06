/**
 * Job Routes — CRUD, Apply, Applicants with AI ranking.
 */
import { FastifyInstance } from 'fastify';
import { createJobSchema, updateJobSchema, jobSearchSchema, updateApplicationSchema } from '@hunar/shared';
import { prisma } from '../../lib/prisma';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { sendSuccess, sendPaginated, sendNoContent } from '../../utils/response';
import { AppError } from '../../middleware/errorHandler';
import { ErrorCodes } from '@hunar/shared';

export async function jobRoutes(app: FastifyInstance): Promise<void> {
  /** GET /jobs — List/search jobs with filters */
  app.get('/', async (request, reply) => {
    const query = jobSearchSchema.parse(request.query);
    const where: any = { status: 'OPEN' };
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.jobType) where.jobType = query.jobType;
    if (query.salaryMin) where.salaryMin = { gte: query.salaryMin };
    if (query.salaryMax) where.salaryMax = { lte: query.salaryMax };
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.skill) {
      where.skillsRequired = { has: query.skill };
    }

    const jobs = await prisma.jobPosting.findMany({
      where,
      include: {
        employer: { select: { companyName: true, logoUrl: true, city: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit! + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
    });

    const hasMore = jobs.length > query.limit!;
    const data = hasMore ? jobs.slice(0, query.limit!) : jobs;
    const nextCursor = hasMore ? data[data.length - 1]?.id : null;
    const total = await prisma.jobPosting.count({ where });

    return sendPaginated(reply, request, data, total, nextCursor);
  });

  /** GET /jobs/:id — Job detail */
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const job = await prisma.jobPosting.findUnique({
      where: { id },
      include: {
        employer: { select: { companyName: true, logoUrl: true, city: true, industry: true, website: true } },
        _count: { select: { applications: true } },
      },
    });
    if (!job) throw new AppError(ErrorCodes.NOT_FOUND, 'Job not found', 404);
    return sendSuccess(reply, request, job);
  });

  /** POST /jobs/:id/apply — Worker applies */
  app.post('/:id/apply', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const { id: jobId } = request.params as { id: string };
    const job = await prisma.jobPosting.findUnique({ where: { id: jobId } });
    if (!job || job.status !== 'OPEN') throw new AppError(ErrorCodes.JOB_CLOSED, 'Job is not open for applications', 400);

    // Check duplicate
    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_workerId: { jobId, workerId: request.userId } },
    });
    if (existing) throw new AppError(ErrorCodes.DUPLICATE_APPLICATION, 'Already applied to this job', 409);

    // Get AI match score
    let aiMatchScore = null;
    try {
      const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const res = await fetch(`${aiUrl}/rank-single`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, worker_id: request.userId }),
      });
      if (res.ok) {
        const data = await res.json();
        aiMatchScore = data.match_score;
      }
    } catch { /* AI service optional */ }

    const application = await prisma.jobApplication.create({
      data: { jobId, workerId: request.userId, aiMatchScore },
      include: { job: true },
    });

    return sendSuccess(reply, request, application, 201);
  });

  /** DELETE /jobs/:id/apply — Withdraw application */
  app.delete('/:id/apply', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const { id: jobId } = request.params as { id: string };
    await prisma.jobApplication.deleteMany({
      where: { jobId, workerId: request.userId, status: 'APPLIED' },
    });
    return sendNoContent(reply);
  });

  /** GET /jobs/:id/applicants — Employer: AI-ranked applicant list */
  app.get('/:id/applicants', { preHandler: [authenticate, authorize('EMPLOYER', 'ADMIN')] }, async (request, reply) => {
    const { id: jobId } = request.params as { id: string };
    const applicants = await prisma.jobApplication.findMany({
      where: { jobId },
      include: {
        worker: {
          include: {
            user: { select: { name: true, avatarUrl: true, phone: true } },
            skills: { include: { skill: true } },
          },
        },
      },
      orderBy: [{ aiMatchScore: 'desc' }, { appliedAt: 'asc' }],
    });
    return sendSuccess(reply, request, applicants);
  });

  /** PUT /jobs/:id/applicants/:workerId — Shortlist/Reject/Hire */
  app.put('/:id/applicants/:workerId', { preHandler: [authenticate, authorize('EMPLOYER', 'ADMIN')] }, async (request, reply) => {
    const { id: jobId, workerId } = request.params as { id: string; workerId: string };
    const { status, note } = updateApplicationSchema.parse(request.body);

    const application = await prisma.jobApplication.update({
      where: { jobId_workerId: { jobId, workerId } },
      data: { status: status as any, employerNote: note },
      include: { worker: { include: { user: { select: { name: true } } } } },
    });

    // If hired, create notification
    if (status === 'HIRED') {
      await prisma.notification.create({
        data: {
          userId: workerId,
          type: 'JOB_HIRED',
          title: 'You\'ve been hired!',
          body: `Congratulations! You have been hired for the position.`,
          data: { jobId },
        },
      });
    }

    return sendSuccess(reply, request, application);
  });
}
