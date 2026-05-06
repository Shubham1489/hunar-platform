/**
 * Platform configuration constants.
 * From docs 12 (Auth), 13 (Business Logic).
 */
export const Config = {
  /** OTP settings */
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 10,
  OTP_MAX_ATTEMPTS: 3,
  OTP_RATE_LIMIT_PER_HOUR: 5,

  /** JWT settings */
  ACCESS_TOKEN_EXPIRY: '24h',
  REFRESH_TOKEN_EXPIRY: '30d',

  /** Rate limiting */
  RATE_LIMIT_AUTH_PER_MIN: 100,
  RATE_LIMIT_UNAUTH_PER_MIN: 20,

  /** Business logic */
  PLATFORM_COMMISSION_RATE: 0.10,
  BOOKING_OTP_EXPIRY_MINUTES: 60,
  BOOKING_OTP_MAX_REGENERATIONS: 3,
  MAX_RECOMMENDATION_RADIUS_KM: 50,
  MAX_BOOKING_RADIUS_KM: 20,

  /** Recommendation */
  RECOMMENDATION_CACHE_TTL_SECONDS: 3600,
  APPLICANT_RANKING_CACHE_TTL_SECONDS: 1800,

  /** Pagination */
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 50,

  /** Session */
  SESSION_IDLE_TIMEOUT_MIN: 15,
  MOBILE_LOCK_TIMEOUT_MIN: 30,

  /** Dispute */
  DISPUTE_WINDOW_HOURS: 48,
  DISPUTE_RESOLUTION_DAYS: 7,

  /** Featured service categories */
  SERVICE_CATEGORIES: [
    'Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Repair',
    'Cleaning', 'Cooking', 'Automotive', 'Construction', 'Housekeeping',
    'Security', 'IT Support', 'Delivery', 'Welding', 'Masonry',
    'Tile Work', 'Gardening', 'Pest Control', 'Appliance Repair', 'Tailoring',
  ],
} as const;
