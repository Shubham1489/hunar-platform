import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(20).max(5000),
  skillsRequired: z.array(z.string()).min(1).max(20),
  experienceMin: z.number().int().min(0).optional().default(0),
  experienceMax: z.number().int().min(0).optional(),
  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  salaryType: z.enum(['HOURLY', 'DAILY', 'MONTHLY']).optional().default('DAILY'),
  jobType: z.enum(['PERMANENT', 'CONTRACT', 'ONEDAY']).optional().default('CONTRACT'),
  city: z.string().max(100).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  openings: z.number().int().min(1).optional().default(1),
});

export const updateJobSchema = createJobSchema.partial();

export const jobSearchSchema = z.object({
  skill: z.string().optional(),
  city: z.string().optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  jobType: z.enum(['PERMANENT', 'CONTRACT', 'ONEDAY']).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  cursor: z.string().optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum(['SHORTLISTED', 'REJECTED', 'HIRED']),
  note: z.string().max(1000).optional(),
});
