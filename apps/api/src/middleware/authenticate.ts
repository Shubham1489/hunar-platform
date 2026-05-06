/**
 * JWT Authentication Middleware
 * RS256 signing, token blacklist check via Redis.
 * From doc 12 — Authentication Requirements.
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis';
import { ErrorCodes } from '@hunar/shared';

/** JWT payload shape */
export interface JwtPayload {
  sub: string;       // user UUID
  role: string;      // WORKER | EMPLOYER | CUSTOMER | ADMIN
  phone: string;
  jti: string;       // unique token ID for blacklisting
  iat: number;
  exp: number;
}

/** Extend FastifyRequest to include user data */
declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
    userRole: string;
    jti: string;
  }
}

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-secret-change-in-production';

/**
 * Authenticate middleware — verifies JWT and checks Redis blacklist.
 * Attach this to protected routes.
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      error: {
        code: ErrorCodes.UNAUTHORIZED,
        message: 'Missing or invalid authorization header',
        status: 401,
      },
      meta: { requestId: request.id, timestamp: new Date().toISOString() },
    });
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Check if token is blacklisted (logged out / revoked)
    const isBlacklisted = await redis.get(`blacklist:${payload.jti}`);
    if (isBlacklisted) {
      return reply.status(401).send({
        success: false,
        error: {
          code: ErrorCodes.TOKEN_EXPIRED,
          message: 'Token has been revoked',
          status: 401,
        },
        meta: { requestId: request.id, timestamp: new Date().toISOString() },
      });
    }

    // Attach user info to request
    request.userId = payload.sub;
    request.userRole = payload.role;
    request.jti = payload.jti;
  } catch (err) {
    const message = err instanceof jwt.TokenExpiredError
      ? 'Token has expired'
      : 'Invalid token';

    return reply.status(401).send({
      success: false,
      error: {
        code: ErrorCodes.INVALID_TOKEN,
        message,
        status: 401,
      },
      meta: { requestId: request.id, timestamp: new Date().toISOString() },
    });
  }
}
