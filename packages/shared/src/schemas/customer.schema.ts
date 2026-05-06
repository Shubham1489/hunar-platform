import { z } from 'zod';

export const updateCustomerProfileSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  defaultCity: z.string().max(100).optional(),
  defaultLat: z.number().min(-90).max(90).optional(),
  defaultLng: z.number().min(-180).max(180).optional(),
});

export const createServiceRequestSchema = z.object({
  serviceType: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  city: z.string().max(100).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  scheduledAt: z.string().datetime().optional(),
});

export const createBookingSchema = z.object({
  serviceRequestId: z.string().uuid(),
  workerId: z.string().uuid(),
  totalAmount: z.number().positive(),
  paymentMethod: z.enum(['UPI', 'CARD', 'NETBANKING', 'WALLET', 'CASH']),
});

export const workerSearchSchema = z.object({
  serviceType: z.string().optional(),
  city: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  maxDistance: z.coerce.number().optional().default(20),
  minRating: z.coerce.number().optional(),
  sortBy: z.enum(['distance', 'rating', 'price']).optional().default('rating'),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  cursor: z.string().optional(),
});
