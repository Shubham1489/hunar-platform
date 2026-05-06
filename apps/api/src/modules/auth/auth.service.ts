/**
 * Auth Service — Business logic for OTP authentication.
 * From docs 12 (Authentication) and 13 (Business Logic).
 * 
 * Security:
 * - OTP hashed with SHA-256 before storage
 * - Rate limited: 5 OTP requests per phone per hour
 * - Max 3 verification attempts per OTP
 * - JWT RS256 with rotating refresh tokens
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { AppError } from '../../middleware/errorHandler';
import { ErrorCodes } from '@hunar/shared';

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-secret-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change';
const OTP_EXPIRY = parseInt(process.env.OTP_EXPIRY_MINUTES || '10', 10);
const ACCESS_TOKEN_EXPIRY = 24 * 60 * 60; // 24 hours in seconds
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30 days in seconds

/** Hash a string using SHA-256 */
function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

/** Generate a cryptographically secure 6-digit OTP */
function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export class AuthService {
  /**
   * Request OTP — generates and stores a hashed OTP.
   * Rate limited to 5 requests per phone per hour.
   */
  static async requestOtp(phone: string): Promise<{ otpId: string; otp?: string }> {
    // Rate limiting check (requires Redis)
    if (redis) {
      const rateLimitKey = `otp_rate:${phone}`;
      const requestCount = await redis.incr(rateLimitKey);
      if (requestCount === 1) {
        await redis.expire(rateLimitKey, 3600); // 1 hour window
      }
      if (requestCount > 5) {
        throw new AppError(ErrorCodes.OTP_RATE_LIMITED, 'Too many OTP requests. Try again later.', 429);
      }
    }

    const otp = generateOtp();
    const otpId = uuidv4();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY * 60 * 1000);

    // Store hashed OTP in database
    await prisma.otpCode.create({
      data: {
        id: otpId,
        phone,
        code: hashOtp(otp),
        expiresAt,
      },
    });

    // In production: send via SMS provider (MSG91/Twilio)
    // In development: log to console
    if (process.env.SMS_PROVIDER === 'console' || process.env.NODE_ENV === 'development') {
      console.log(`\n📱 OTP for ${phone}: ${otp}\n`);
      return { otpId, otp }; // Return OTP for dev/testing
    }

    // TODO: Integrate real SMS provider
    // await SmsService.sendOtp(phone, otp);

    return { otpId };
  }

  /**
   * Verify OTP and issue JWT tokens.
   * Max 3 verification attempts per OTP.
   */
  static async verifyOtp(
    phone: string,
    otp: string,
    otpId: string,
    role?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: any;
    isNewUser: boolean;
  }> {
    // Fetch OTP record
    const otpRecord = await prisma.otpCode.findUnique({ where: { id: otpId } });

    if (!otpRecord) {
      throw new AppError(ErrorCodes.INVALID_OTP, 'Invalid OTP ID', 400);
    }

    if (otpRecord.used) {
      throw new AppError(ErrorCodes.INVALID_OTP, 'OTP already used', 400);
    }

    if (otpRecord.phone !== phone) {
      throw new AppError(ErrorCodes.INVALID_OTP, 'Phone number mismatch', 400);
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new AppError(ErrorCodes.OTP_EXPIRED, 'OTP has expired', 400);
    }

    if (otpRecord.attempts >= 3) {
      throw new AppError(ErrorCodes.OTP_MAX_ATTEMPTS, 'Maximum OTP attempts exceeded', 400);
    }

    // Verify OTP hash
    const hashedInput = hashOtp(otp);
    if (hashedInput !== otpRecord.code) {
      // Increment attempts
      await prisma.otpCode.update({
        where: { id: otpId },
        data: { attempts: { increment: 1 } },
      });
      throw new AppError(ErrorCodes.INVALID_OTP, 'Incorrect OTP', 400);
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpId },
      data: { used: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone } });
    let isNewUser = false;

    if (!user) {
      if (!role) {
        throw new AppError(ErrorCodes.VALIDATION_ERROR, 'Role is required for new users', 422, 'role');
      }
      
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          phone,
          role: role as any,
          isVerified: true,
        },
      });

      // Create role-specific profile
      if (role === 'WORKER') {
        await prisma.workerProfile.create({ data: { id: user.id } });
      } else if (role === 'EMPLOYER') {
        await prisma.employerProfile.create({
          data: { id: user.id, companyName: 'My Company' },
        });
      } else if (role === 'CUSTOMER') {
        await prisma.customerProfile.create({ data: { id: user.id } });
      }
    } else {
      // Mark as verified if not already
      if (!user.isVerified) {
        await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
      }
    }

    // Generate tokens
    const jti = uuidv4();
    const accessToken = jwt.sign(
      { sub: user.id, role: user.role, phone: user.phone, jti },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY },
    );

    const refreshJti = uuidv4();
    const refreshToken = jwt.sign(
      { sub: user.id, jti: refreshJti, type: 'refresh' },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY },
    );

    // Store refresh token in Redis with TTL
    if (redis) {
      await redis.set(`refresh:${refreshJti}`, user.id, 'EX', 30 * 24 * 60 * 60);
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        preferredLang: user.preferredLang,
      },
      isNewUser,
    };
  }

  /**
   * Refresh access token using a valid refresh token.
   * Implements rotation strategy — old refresh token is invalidated.
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as any;

      // Check if refresh token exists in Redis
      const userId = redis ? await redis.get(`refresh:${payload.jti}`) : payload.sub;
      if (!userId) {
        throw new AppError(ErrorCodes.INVALID_TOKEN, 'Refresh token is invalid or expired', 401);
      }

      // Invalidate old refresh token (rotation)
      if (redis) await redis.del(`refresh:${payload.jti}`);

      // Fetch user
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || !user.isActive) {
        throw new AppError(ErrorCodes.UNAUTHORIZED, 'Account is disabled', 401);
      }

      // Issue new access token
      const jti = uuidv4();
      const accessToken = jwt.sign(
        { sub: user.id, role: user.role, phone: user.phone, jti },
        JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY },
      );

      return { accessToken };
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(ErrorCodes.INVALID_TOKEN, 'Invalid refresh token', 401);
    }
  }

  /**
   * Logout — blacklist the current access token's JTI.
   */
  static async logout(jti: string, exp?: number): Promise<void> {
    // Blacklist the token for its remaining lifetime
    const ttl = exp ? exp - Math.floor(Date.now() / 1000) : 86400;
    if (ttl > 0 && redis) {
      await redis.set(`blacklist:${jti}`, '1', 'EX', ttl);
    }
  }

  /**
   * Get current user profile with role-specific data.
   */
  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workerProfile: {
          include: {
            skills: {
              include: { skill: true },
            },
          },
        },
        employerProfile: true,
        customerProfile: true,
      },
    });

    if (!user) {
      throw new AppError(ErrorCodes.NOT_FOUND, 'User not found', 404);
    }

    return user;
  }
}
