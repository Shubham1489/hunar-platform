/// All API endpoint constants matching the backend REST API
class ApiEndpoints {
  ApiEndpoints._();

  /// Base URL — change for production
  static const String baseUrl = 'http://10.0.2.2:3001/api/v1'; // Android emulator
  // static const String baseUrl = 'http://localhost:3001/api/v1'; // iOS simulator

  // ─── Auth ─────────────────────────────────
  static const String authRequestOtp = '/auth/request-otp';
  static const String authVerifyOtp = '/auth/verify-otp';
  static const String authRefresh = '/auth/refresh';
  static const String authLogout = '/auth/logout';
  static const String authMe = '/auth/me';

  // ─── Workers ──────────────────────────────
  static String workerProfile(String id) => '/workers/$id';
  static const String workerMe = '/workers/me';
  static const String workerRecommendations = '/workers/me/recommendations';
  static const String workerSkills = '/workers/me/skills';
  static const String workerSkillsVoice = '/workers/me/skills/voice';
  static const String workerAvailability = '/workers/me/availability';
  static const String workerApplications = '/workers/me/applications';
  static const String workerBookings = '/workers/me/bookings';
  static const String workerEarnings = '/workers/me/earnings';
  static const String workerOtpConfirm = '/workers/me/otp-confirm';

  // ─── Jobs ─────────────────────────────────
  static const String jobs = '/jobs';
  static String jobDetail(String id) => '/jobs/$id';
  static String jobApply(String id) => '/jobs/$id/apply';
  static String jobApplicants(String id) => '/jobs/$id/applicants';
  static String jobApplicantAction(String jobId, String workerId) =>
      '/jobs/$jobId/applicants/$workerId';

  // ─── Employers ────────────────────────────
  static const String employerMe = '/employers/me';
  static const String employerJobs = '/employers/me/jobs';
  static const String employerPostJob = '/employers/jobs';
  static String employerEditJob(String id) => '/employers/jobs/$id';
  static const String employerWorkers = '/employers/workers';
  static String employerOffer(String workerId) => '/employers/workers/$workerId/offer';
  static const String employerAnalytics = '/employers/analytics';

  // ─── Customers ────────────────────────────
  static const String customerMe = '/customers/me';
  static const String customerServiceRequests = '/customers/service-requests';
  static const String customerWorkers = '/customers/workers';
  static const String customerBookings = '/customers/bookings';
  static String customerBookingDetail(String id) => '/customers/bookings/$id';
  static String customerBookingComplete(String id) => '/customers/bookings/$id/complete';
  static String customerBookingDispute(String id) => '/customers/bookings/$id/dispute';
  static String customerBookingRate(String id) => '/customers/bookings/$id/rate';

  // ─── Payments ─────────────────────────────
  static const String paymentInitiate = '/payments/initiate';
  static const String paymentVerify = '/payments/verify';

  // ─── Ratings ──────────────────────────────
  static const String ratings = '/ratings';
  static String workerRatings(String workerId) => '/ratings/worker/$workerId';

  // ─── AI ───────────────────────────────────
  static const String aiRecommendations = '/ai/recommendations';
  static const String aiExtractSkills = '/ai/extract-skills';
  static const String aiPredictSalary = '/ai/predict-salary';
  static const String aiRankApplicants = '/ai/rank-applicants';

  // ─── Notifications ────────────────────────
  static const String notifications = '/notifications';
  static String notificationRead(String id) => '/notifications/$id/read';
  static const String notificationsReadAll = '/notifications/read-all';
}
