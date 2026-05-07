/**
 * Hunar API Server — Main Entry Point
 * Fastify 4 with plugin architecture
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';

import { prisma } from './lib/prisma';
import { redis } from './lib/redis';
import { errorHandler } from './middleware/errorHandler';

// Routes
import { authRoutes } from './modules/auth/auth.routes';
import { workerRoutes } from './modules/workers/worker.routes';
import { jobRoutes } from './modules/jobs/job.routes';
import { employerRoutes } from './modules/employers/employer.routes';
import { customerRoutes } from './modules/customers/customer.routes';
import { paymentRoutes } from './modules/payments/payment.routes';
import { ratingRoutes } from './modules/ratings/rating.routes';
import { notificationRoutes } from './modules/notifications/notification.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { aiRoutes } from './modules/ai/ai.routes';

dotenv.config({ path: '../../.env' });

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = '0.0.0.0';

async function buildServer() {
  const app = Fastify({
    logger: {
      transport: process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
    requestIdHeader: 'x-request-id',
    genReqId: () => crypto.randomUUID(),
  });

  // ─── Global Error Handler ────────────────────
  app.setErrorHandler(errorHandler);

  // ─── Plugins ─────────────────────────────────
  await app.register(helmet, { global: true });

  await app.register(cors, {
    origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    credentials: true,
  });

  // ─── Health Check (registered BEFORE rate-limit) ──
  // Lightweight endpoint for Render / load-balancer health probes.
  // Must respond fast and never depend on external services.
  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));

  // Detailed health check for diagnostics (not used by Render)
  app.get('/health/detailed', async () => {
    const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
      Promise.race([
        promise,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
      ]);

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: await withTimeout(prisma.$queryRaw`SELECT 1`, 3000).then(() => 'connected').catch(() => 'disconnected'),
        redis: redis ? await withTimeout(redis.ping(), 3000).then(() => 'connected').catch(() => 'disconnected') : 'not configured',
      },
    };
  });

  // Rate limiting — only use Redis store if redis is connected
  // Passing a broken redis client to rate-limit hangs ALL requests
  let rateLimitRedis: typeof redis = null;
  if (redis) {
    try {
      await redis.ping();
      rateLimitRedis = redis;
    } catch {
      console.warn('⚠️  Redis not reachable — rate limiting will use in-memory store');
    }
  }

  await app.register(rateLimit, {
    max: parseInt(process.env.RATE_LIMIT_AUTH || '100', 10),
    timeWindow: '1 minute',
    ...(rateLimitRedis ? { redis: rateLimitRedis } : {}),
  });

  // ─── Swagger / OpenAPI ───────────────────────
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Hunar API',
        description: 'AI-Powered Blue-Collar Job Platform — REST API',
        version: '1.0.0',
      },
      servers: [{ url: `http://localhost:${PORT}` }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: { docExpansion: 'list', deepLinking: true },
  });

  // (Health check routes registered above, before rate-limit)

  // ─── API Routes (versioned under /api/v1) ────
  await app.register(async (api) => {
    await api.register(authRoutes, { prefix: '/auth' });
    await api.register(workerRoutes, { prefix: '/workers' });
    await api.register(jobRoutes, { prefix: '/jobs' });
    await api.register(employerRoutes, { prefix: '/employers' });
    await api.register(customerRoutes, { prefix: '/customers' });
    await api.register(paymentRoutes, { prefix: '/payments' });
    await api.register(ratingRoutes, { prefix: '/ratings' });
    await api.register(notificationRoutes, { prefix: '/notifications' });
    await api.register(adminRoutes, { prefix: '/admin' });
    await api.register(aiRoutes, { prefix: '/ai' });
  }, { prefix: '/api/v1' });

  return app;
}

// ─── Start Server ──────────────────────────────
buildServer()
  .then(async (app) => {
    await app.listen({ port: PORT, host: HOST });
    console.log(`\n🚀 Hunar API running at http://localhost:${PORT}`);
    console.log(`📚 Swagger docs at http://localhost:${PORT}/docs\n`);
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
