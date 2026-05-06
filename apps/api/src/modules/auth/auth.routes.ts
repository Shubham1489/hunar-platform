/**
 * Auth Routes — Registration, Login, Token Refresh, Logout.
 * From doc 09 — API Endpoints.
 */

import { FastifyInstance } from 'fastify';
import { requestOtpSchema, verifyOtpSchema, refreshTokenSchema } from '@hunar/shared';
import { AuthService } from './auth.service';
import { authenticate } from '../../middleware/authenticate';
import { sendSuccess } from '../../utils/response';

export async function authRoutes(app: FastifyInstance): Promise<void> {
  /**
   * POST /auth/request-otp
   * Request OTP for phone number (public endpoint)
   */
  app.post('/request-otp', async (request, reply) => {
    const body = requestOtpSchema.parse(request.body);
    const result = await AuthService.requestOtp(body.phone);
    return sendSuccess(reply, request, result, 200);
  });

  /**
   * POST /auth/verify-otp
   * Verify OTP + login / register
   */
  app.post('/verify-otp', async (request, reply) => {
    const body = verifyOtpSchema.parse(request.body);
    const result = await AuthService.verifyOtp(body.phone, body.otp, body.otpId, body.role);
    return sendSuccess(reply, request, result, 200);
  });

  /**
   * POST /auth/refresh
   * Refresh access token
   */
  app.post('/refresh', async (request, reply) => {
    const body = refreshTokenSchema.parse(request.body);
    const result = await AuthService.refreshToken(body.refreshToken);
    return sendSuccess(reply, request, result);
  });

  /**
   * POST /auth/logout
   * Invalidate current token
   */
  app.post('/logout', { preHandler: [authenticate] }, async (request, reply) => {
    await AuthService.logout(request.jti);
    return sendSuccess(reply, request, { message: 'Logged out successfully' });
  });

  /**
   * GET /auth/me
   * Get current authenticated user with profile
   */
  app.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const user = await AuthService.getCurrentUser(request.userId);
    return sendSuccess(reply, request, user);
  });
}
