/**
 * Worker Routes — Profile, Skills, Recommendations, Applications, Bookings, Earnings.
 */

import { FastifyInstance } from 'fastify';
import { updateWorkerProfileSchema, addSkillSchema, voiceSkillSchema, toggleAvailabilitySchema, otpConfirmSchema } from '@hunar/shared';
import { WorkerService } from './worker.service';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { sendSuccess, sendPaginated, sendNoContent } from '../../utils/response';

export async function workerRoutes(app: FastifyInstance): Promise<void> {
  /** GET /workers/:id — Public worker profile */
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const worker = await WorkerService.getProfile(id);
    return sendSuccess(reply, request, worker);
  });

  /** PUT /workers/me — Update own profile */
  app.put('/me', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const data = updateWorkerProfileSchema.parse(request.body);
    const worker = await WorkerService.updateProfile(request.userId, data);
    return sendSuccess(reply, request, worker);
  });

  /** GET /workers/me/recommendations — AI job feed */
  app.get('/me/recommendations', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const jobs = await WorkerService.getRecommendations(request.userId);
    return sendSuccess(reply, request, jobs);
  });

  /** POST /workers/me/skills — Add skill by text */
  app.post('/me/skills', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const { skillName, level, years } = addSkillSchema.parse(request.body);
    const skill = await WorkerService.addSkill(request.userId, skillName, level!, years!);
    return sendSuccess(reply, request, skill, 201);
  });

  /** POST /workers/me/skills/voice — Add skills via voice transcript */
  app.post('/me/skills/voice', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const { transcript, lang } = voiceSkillSchema.parse(request.body);
    // Proxy to AI service
    const aiUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    try {
      const aiResponse = await fetch(`${aiUrl}/extract-skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, lang }),
      });
      const extracted = await aiResponse.json();
      return sendSuccess(reply, request, extracted);
    } catch {
      return sendSuccess(reply, request, { skills: [], message: 'AI service unavailable' });
    }
  });

  /** DELETE /workers/me/skills/:skillId — Remove a skill */
  app.delete('/me/skills/:skillId', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const { skillId } = request.params as { skillId: string };
    await WorkerService.removeSkill(request.userId, skillId);
    return sendNoContent(reply);
  });

  /** PUT /workers/me/availability — Toggle availability */
  app.put('/me/availability', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const { isAvailable } = toggleAvailabilitySchema.parse(request.body);
    const result = await WorkerService.toggleAvailability(request.userId, isAvailable);
    return sendSuccess(reply, request, result);
  });

  /** GET /workers/me/applications — My job applications */
  app.get('/me/applications', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const { cursor, limit } = request.query as { cursor?: string; limit?: string };
    const result = await WorkerService.getApplications(request.userId, cursor, parseInt(limit || '20'));
    return sendPaginated(reply, request, result.data, result.total, result.nextCursor);
  });

  /** GET /workers/me/bookings — My bookings */
  app.get('/me/bookings', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const bookings = await WorkerService.getBookings(request.userId);
    return sendSuccess(reply, request, bookings);
  });

  /** GET /workers/me/earnings — Earnings history */
  app.get('/me/earnings', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const earnings = await WorkerService.getEarnings(request.userId);
    return sendSuccess(reply, request, earnings);
  });

  /** POST /workers/me/otp-confirm — Confirm job completion OTP */
  app.post('/me/otp-confirm', { preHandler: [authenticate, authorize('WORKER')] }, async (request, reply) => {
    const { bookingId, otp } = otpConfirmSchema.parse(request.body);
    const result = await WorkerService.confirmOtp(request.userId, bookingId, otp);
    return sendSuccess(reply, request, result);
  });
}
