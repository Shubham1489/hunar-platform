import { z } from 'zod';

export const updateWorkerProfileSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  bio: z.string().max(1000).optional(),
  dailyRate: z.number().positive().optional(),
  hourlyRate: z.number().positive().optional(),
  city: z.string().max(100).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  mode: z.enum(['HIRER', 'FREELANCER', 'BOTH']).optional(),
  experienceYears: z.number().int().min(0).max(50).optional(),
});

export const addSkillSchema = z.object({
  skillName: z.string().min(1).max(100),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'EXPERT']).optional().default('INTERMEDIATE'),
  years: z.number().int().min(0).max(50).optional().default(0),
});

export const voiceSkillSchema = z.object({
  transcript: z.string().min(1).max(5000),
  lang: z.string().max(10).optional().default('auto'),
});

export const toggleAvailabilitySchema = z.object({
  isAvailable: z.boolean(),
});

export const otpConfirmSchema = z.object({
  bookingId: z.string().uuid(),
  otp: z.string().length(6).regex(/^\d{6}$/),
});
