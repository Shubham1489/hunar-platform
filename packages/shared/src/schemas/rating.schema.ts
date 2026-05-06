import { z } from 'zod';

export const submitRatingSchema = z.object({
  bookingId: z.string().uuid(),
  score: z.number().int().min(1).max(5),
  review: z.string().max(2000).optional(),
});

export const reportRatingSchema = z.object({
  reason: z.string().min(10).max(500),
});
