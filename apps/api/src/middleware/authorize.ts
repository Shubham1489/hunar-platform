/**
 * Role-Based Access Control (RBAC) Middleware
 * From doc 12 — Authentication Requirements.
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { ErrorCodes } from '@hunar/shared';

/**
 * Creates an RBAC middleware that restricts access to specified roles.
 * @param allowedRoles - Array of roles permitted to access the route
 */
export function authorize(...allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.userRole) {
      return reply.status(401).send({
        success: false,
        error: {
          code: ErrorCodes.UNAUTHORIZED,
          message: 'Authentication required',
          status: 401,
        },
        meta: { requestId: request.id, timestamp: new Date().toISOString() },
      });
    }

    if (!allowedRoles.includes(request.userRole)) {
      return reply.status(403).send({
        success: false,
        error: {
          code: ErrorCodes.FORBIDDEN,
          message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
          status: 403,
        },
        meta: { requestId: request.id, timestamp: new Date().toISOString() },
      });
    }
  };
}
