/**
 * Global error handler for standardized error responses.
 * From doc 08 — API Structure.
 */

import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { ErrorCodes } from '@hunar/shared';

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const meta = {
    requestId: request.id,
    timestamp: new Date().toISOString(),
  };

  // Zod validation errors
  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    reply.status(422).send({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: firstIssue?.message || 'Validation error',
        field: firstIssue?.path?.join('.'),
        status: 422,
        details: error.issues,
      },
      meta,
    });
    return;
  }

  // Fastify errors with status codes
  if ('statusCode' in error) {
    const statusCode = (error as FastifyError).statusCode || 500;
    reply.status(statusCode).send({
      success: false,
      error: {
        code: statusCode === 429 ? ErrorCodes.RATE_LIMITED : ErrorCodes.INTERNAL_ERROR,
        message: error.message,
        status: statusCode,
      },
      meta,
    });
    return;
  }

  // Custom app errors with code property
  if ('code' in error && 'statusCode' in error) {
    const appError = error as any;
    reply.status(appError.statusCode).send({
      success: false,
      error: {
        code: appError.code,
        message: appError.message,
        field: appError.field,
        status: appError.statusCode,
      },
      meta,
    });
    return;
  }

  // Unknown errors
  request.log.error(error);
  reply.status(500).send({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : error.message,
      status: 500,
    },
    meta,
  });
}

/**
 * Custom application error class.
 * Use this for business logic errors with proper error codes.
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly field?: string;

  constructor(code: string, message: string, statusCode: number, field?: string) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.field = field;
    this.name = 'AppError';
  }
}
