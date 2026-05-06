/**
 * AI Routes — Proxy endpoints to Python AI microservice.
 */
import { FastifyInstance } from 'fastify';
import { authenticate } from '../../middleware/authenticate';
import { sendSuccess } from '../../utils/response';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export async function aiRoutes(app: FastifyInstance): Promise<void> {
  /** GET /ai/recommendations */
  app.get('/recommendations', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const res = await fetch(`${AI_SERVICE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: request.userId }),
      });
      const data = await res.json();
      return sendSuccess(reply, request, data);
    } catch {
      return sendSuccess(reply, request, { jobs: [], message: 'AI service unavailable' });
    }
  });

  /** POST /ai/extract-skills */
  app.post('/extract-skills', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const res = await fetch(`${AI_SERVICE_URL}/extract-skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body),
      });
      const data = await res.json();
      return sendSuccess(reply, request, data);
    } catch {
      return sendSuccess(reply, request, { skills: [], message: 'AI service unavailable' });
    }
  });

  /** POST /ai/predict-salary */
  app.post('/predict-salary', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const res = await fetch(`${AI_SERVICE_URL}/predict-salary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body),
      });
      const data = await res.json();
      return sendSuccess(reply, request, data);
    } catch {
      return sendSuccess(reply, request, { daily_rate_min: 500, daily_rate_median: 800, daily_rate_max: 1200 });
    }
  });

  /** POST /ai/rank-applicants */
  app.post('/rank-applicants', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      const res = await fetch(`${AI_SERVICE_URL}/rank-applicants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.body),
      });
      const data = await res.json();
      return sendSuccess(reply, request, data);
    } catch {
      return sendSuccess(reply, request, { applicants: [], message: 'AI service unavailable' });
    }
  });
}
