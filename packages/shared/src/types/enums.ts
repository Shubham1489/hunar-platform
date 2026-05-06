/**
 * Platform-wide enumerations matching the database schema.
 * These enums are used across all services for type safety.
 */

/** User roles in the Hunar platform */
export enum Role {
  WORKER = 'WORKER',
  EMPLOYER = 'EMPLOYER',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

/** Worker's preferred work mode */
export enum WorkerMode {
  HIRER = 'HIRER',
  FREELANCER = 'FREELANCER',
  BOTH = 'BOTH',
}

/** Skill proficiency level */
export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT',
}

/** Job posting lifecycle status */
export enum JobStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  FILLED = 'FILLED',
}

/** Type of employment */
export enum JobType {
  PERMANENT = 'PERMANENT',
  CONTRACT = 'CONTRACT',
  ONEDAY = 'ONEDAY',
}

/** Salary calculation period */
export enum SalaryType {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
}

/** Job application lifecycle status */
export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  SHORTLISTED = 'SHORTLISTED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

/** Booking lifecycle status */
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
  CANCELLED = 'CANCELLED',
}

/** Service request status */
export enum ServiceRequestStatus {
  OPEN = 'OPEN',
  MATCHED = 'MATCHED',
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/** Payment method */
export enum PaymentMethod {
  UPI = 'UPI',
  CARD = 'CARD',
  NETBANKING = 'NETBANKING',
  WALLET = 'WALLET',
  CASH = 'CASH',
}

/** Payment lifecycle status */
export enum PaymentStatus {
  PENDING = 'PENDING',
  HELD = 'HELD',
  RELEASED = 'RELEASED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

/** Payment reference type */
export enum PaymentReferenceType {
  BOOKING = 'BOOKING',
  JOB = 'JOB',
}

/** Notification type */
export enum NotificationType {
  JOB_APPLIED = 'JOB_APPLIED',
  JOB_SHORTLISTED = 'JOB_SHORTLISTED',
  JOB_HIRED = 'JOB_HIRED',
  JOB_REJECTED = 'JOB_REJECTED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_STARTED = 'BOOKING_STARTED',
  OTP_CONFIRMED = 'OTP_CONFIRMED',
  PAYMENT_RELEASED = 'PAYMENT_RELEASED',
  RATING_RECEIVED = 'RATING_RECEIVED',
  DISPUTE_RAISED = 'DISPUTE_RAISED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  DIRECT_OFFER = 'DIRECT_OFFER',
}
