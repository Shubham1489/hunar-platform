import { z } from 'zod';

export const updateEmployerProfileSchema = z.object({
  companyName: z.string().min(2).max(200).optional(),
  gstNumber: z.string().max(20).optional(),
  industry: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  website: z.string().url().optional(),
});

export const directOfferSchema = z.object({
  jobId: z.string().uuid(),
  message: z.string().max(1000).optional(),
});
