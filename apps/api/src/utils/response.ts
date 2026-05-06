/**
 * Standard API response helpers.
 * Follows the format from doc 08 — API Structure.
 */

import { FastifyReply, FastifyRequest } from 'fastify';

/** Send a success response with data */
export function sendSuccess<T>(
  reply: FastifyReply,
  request: FastifyRequest,
  data: T,
  statusCode = 200,
) {
  return reply.status(statusCode).send({
    success: true,
    data,
    meta: {
      requestId: request.id,
      timestamp: new Date().toISOString(),
    },
  });
}

/** Send a paginated success response */
export function sendPaginated<T>(
  reply: FastifyReply,
  request: FastifyRequest,
  data: T[],
  total: number,
  nextCursor: string | null,
) {
  return reply.status(200).send({
    success: true,
    data,
    nextCursor,
    total,
    meta: {
      requestId: request.id,
      timestamp: new Date().toISOString(),
    },
  });
}

/** Send a 204 No Content response */
export function sendNoContent(reply: FastifyReply) {
  return reply.status(204).send();
}
