/**
 * API request/response type definitions.
 * Standard response format from doc 08.
 */

// ─── Standard API Response ───────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  status: number;
}

export interface ApiMeta {
  requestId: string;
  timestamp: string;
}

// ─── Pagination ──────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  total: number;
}

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

// ─── Auth API ────────────────────────────────────────

export interface RequestOtpRequest {
  phone: string;
}

export interface RequestOtpResponse {
  otpId: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
  otpId: string;
  role?: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: import('./entities').User;
  isNewUser: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// ─── Worker API ──────────────────────────────────────

export interface UpdateWorkerProfileRequest {
  name?: string;
  bio?: string;
  dailyRate?: number;
  hourlyRate?: number;
  city?: string;
  lat?: number;
  lng?: number;
  mode?: string;
  experienceYears?: number;
}

export interface AddSkillRequest {
  skillName: string;
  level?: string;
  years?: number;
}

export interface VoiceSkillRequest {
  transcript: string;
  lang?: string;
}

// ─── Job API ─────────────────────────────────────────

export interface CreateJobRequest {
  title: string;
  description: string;
  skillsRequired: string[];
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  jobType?: string;
  city?: string;
  lat?: number;
  lng?: number;
  openings?: number;
}

export interface JobSearchParams extends PaginationParams {
  skill?: string;
  city?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType?: string;
  search?: string;
}

export interface UpdateApplicationRequest {
  status: 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  note?: string;
}

// ─── Customer API ────────────────────────────────────

export interface CreateServiceRequestRequest {
  serviceType: string;
  description?: string;
  city?: string;
  lat?: number;
  lng?: number;
  scheduledAt?: string;
}

export interface CreateBookingRequest {
  serviceRequestId: string;
  workerId: string;
  totalAmount: number;
  paymentMethod: string;
}

export interface RateWorkerRequest {
  score: number;
  review?: string;
}

// ─── Payment API ─────────────────────────────────────

export interface InitiatePaymentRequest {
  bookingId: string;
  amount: number;
  method: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

// ─── AI API ──────────────────────────────────────────

export interface ExtractSkillsRequest {
  transcript: string;
  lang?: string;
}

export interface PredictSalaryRequest {
  skills: string[];
  experienceYears: number;
  city: string;
  jobType?: string;
}

export interface RankApplicantsRequest {
  jobId: string;
}
