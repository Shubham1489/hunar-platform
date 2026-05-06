import { z } from 'zod';

/** Phone number: Indian format (10 digits) */
const phoneRegex = /^[6-9]\d{9}$/;

export const requestOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid Indian phone number (10 digits, starts with 6-9)'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(phoneRegex, 'Invalid phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
  otpId: z.string().uuid('Invalid OTP ID'),
  role: z.enum(['WORKER', 'EMPLOYER', 'CUSTOMER']).optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
