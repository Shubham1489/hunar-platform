/**
 * Entity type definitions matching the database models.
 * Used across API, web, and mobile for consistent typing.
 */

import {
  Role, WorkerMode, SkillLevel, JobStatus, JobType,
  SalaryType, ApplicationStatus, BookingStatus,
  ServiceRequestStatus, PaymentMethod, PaymentStatus,
  NotificationType, PaymentReferenceType,
} from './enums';

// ─── Location ────────────────────────────────────────

export interface Location {
  city?: string;
  lat?: number;
  lng?: number;
}

// ─── User ────────────────────────────────────────────

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: Role;
  avatarUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  fcmToken?: string;
  preferredLang: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Worker ──────────────────────────────────────────

export interface WorkerProfile {
  id: string;
  mode: WorkerMode;
  experienceYears: number;
  dailyRate?: number;
  hourlyRate?: number;
  city?: string;
  lat?: number;
  lng?: number;
  bio?: string;
  isAvailable: boolean;
  ratingAvg: number;
  ratingCount: number;
  skills: WorkerSkill[];
  user?: User;
}

export interface Skill {
  id: string;
  nameEn: string;
  nameHi?: string;
  category: string;
  aliases: string[];
}

export interface WorkerSkill {
  id: string;
  workerId: string;
  skillId: string;
  skill?: Skill;
  level: SkillLevel;
  years: number;
}

// ─── Employer ────────────────────────────────────────

export interface EmployerProfile {
  id: string;
  companyName: string;
  gstNumber?: string;
  industry?: string;
  city?: string;
  lat?: number;
  lng?: number;
  website?: string;
  logoUrl?: string;
  user?: User;
}

// ─── Job ─────────────────────────────────────────────

export interface JobPosting {
  id: string;
  employerId: string;
  employer?: EmployerProfile;
  title: string;
  description: string;
  skillsRequired: string[];
  experienceMin: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryType: SalaryType;
  jobType: JobType;
  city?: string;
  lat?: number;
  lng?: number;
  status: JobStatus;
  openings: number;
  applicantCount?: number;
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  job?: JobPosting;
  worker?: WorkerProfile;
  status: ApplicationStatus;
  aiMatchScore?: number;
  employerNote?: string;
  appliedAt: string;
}

// ─── Customer ────────────────────────────────────────

export interface CustomerProfile {
  id: string;
  defaultCity?: string;
  defaultLat?: number;
  defaultLng?: number;
  user?: User;
}

export interface ServiceRequest {
  id: string;
  customerId: string;
  serviceType: string;
  description?: string;
  city?: string;
  lat?: number;
  lng?: number;
  scheduledAt?: string;
  status: ServiceRequestStatus;
  createdAt: string;
}

// ─── Booking ─────────────────────────────────────────

export interface Booking {
  id: string;
  serviceRequestId: string;
  customerId: string;
  workerId: string;
  serviceRequest?: ServiceRequest;
  customer?: CustomerProfile;
  worker?: WorkerProfile;
  status: BookingStatus;
  totalAmount: number;
  platformFee: number;
  otpCode?: string;
  otpVerified: boolean;
  otpExpiresAt?: string;
  payment?: Payment;
  rating?: Rating;
  confirmedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ─────────────────────────────────────────

export interface Payment {
  id: string;
  referenceType: PaymentReferenceType;
  referenceId: string;
  payerId: string;
  payeeId: string;
  amount: number;
  platformFee: number;
  method: PaymentMethod;
  status: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

// ─── Rating ──────────────────────────────────────────

export interface Rating {
  id: string;
  bookingId: string;
  raterId: string;
  rateeId: string;
  score: number;
  review?: string;
  isReported: boolean;
  createdAt: string;
}

// ─── Notification ────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

// ─── AI Types ────────────────────────────────────────

export interface RecommendedJob extends JobPosting {
  matchScore: number;
  skillMatchScore: number;
  locationScore: number;
}

export interface ExtractedSkill {
  skillId: string;
  nameEn: string;
  confidence: number;
}

export interface SalaryPrediction {
  dailyRateMin: number;
  dailyRateMedian: number;
  dailyRateMax: number;
}

export interface RankedApplicant extends JobApplication {
  matchScore: number;
  experienceBonus: number;
}
