/**
 * Hunar Shared Types — Used across API and Web
 */

// ─── Re-export Validation Schemas ──────────
export { requestOtpSchema, verifyOtpSchema, refreshTokenSchema } from './schemas/auth.schema';
export { createJobSchema, updateJobSchema, jobSearchSchema, updateApplicationSchema } from './schemas/job.schema';
export { updateWorkerProfileSchema, addSkillSchema, voiceSkillSchema, toggleAvailabilitySchema, otpConfirmSchema } from './schemas/worker.schema';
export { updateEmployerProfileSchema, directOfferSchema } from './schemas/employer.schema';
export { initiatePaymentSchema, verifyPaymentSchema } from './schemas/payment.schema';
export { createServiceRequestSchema, createBookingSchema, workerSearchSchema, updateCustomerProfileSchema } from './schemas/customer.schema';
export { submitRatingSchema, reportRatingSchema } from './schemas/rating.schema';

// ─── Re-export Constants ───────────────────
export { ErrorCodes } from './constants/errors';
export type { ErrorCode } from './constants/errors';


// ─── User Roles ────────────────────────────
export type UserRole = 'WORKER' | 'EMPLOYER' | 'CUSTOMER' | 'ADMIN';

// ─── Auth ──────────────────────────────────
export interface LoginRequest {
  phone: string;
}

export interface OtpVerifyRequest {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
  isNewUser: boolean;
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  createdAt: string;
}

// ─── Worker ────────────────────────────────
export interface Worker {
  id: string;
  userId: string;
  name: string;
  phone: string;
  skills: string[];
  experience: number;
  city: string;
  rating: number;
  totalJobs: number;
  available: boolean;
  verified: boolean;
  dailyRate: number;
  bio?: string;
  avatar?: string;
  latitude?: number;
  longitude?: number;
}

// ─── Job ───────────────────────────────────
export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'FILLED' | 'CLOSED' | 'CANCELLED';
export type JobType = 'ONE_DAY' | 'CONTRACT' | 'PERMANENT';
export type ApplicationStatus = 'APPLIED' | 'SHORTLISTED' | 'HIRED' | 'REJECTED';

export interface Job {
  id: string;
  title: string;
  description: string;
  employerId: string;
  companyName: string;
  city: string;
  skills: string[];
  jobType: JobType;
  dailyRate: number;
  status: JobStatus;
  urgent: boolean;
  applicantCount: number;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  status: ApplicationStatus;
  aiScore?: number;
  appliedAt: string;
  job?: Job;
  worker?: Worker;
}

// ─── Booking ───────────────────────────────
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  customerId: string;
  workerId: string;
  serviceType: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  amount: number;
  platformFee: number;
  total: number;
  status: BookingStatus;
  paymentMethod: string;
  otpCode?: string;
  rating?: number;
  review?: string;
  worker?: Worker;
}

// ─── Rating ────────────────────────────────
export interface Rating {
  id: string;
  fromId: string;
  toId: string;
  bookingId?: string;
  score: number;
  review?: string;
  createdAt: string;
}

// ─── Notification ──────────────────────────
export type NotificationType = 'JOB_MATCH' | 'APPLICATION_UPDATE' | 'BOOKING_UPDATE' | 'PAYMENT' | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: string;
}

// ─── AI Types ──────────────────────────────
export interface AIRecommendation {
  jobId: string;
  score: number;
  matchReasons: string[];
}

export interface SkillExtraction {
  skills: string[];
  confidence: number;
  language: string;
}

export interface SalaryPrediction {
  min: number;
  median: number;
  max: number;
  confidence: number;
}

export interface ApplicantRank {
  workerId: string;
  score: number;
  breakdown: {
    skillMatch: number;
    experience: number;
    rating: number;
    proximity: number;
  };
}

// ─── API Response Wrappers ────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
