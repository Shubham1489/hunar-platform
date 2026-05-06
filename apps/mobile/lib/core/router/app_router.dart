import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../auth/auth_provider.dart';

// ─── Feature Screens ─────────────────────────
import '../../features/auth/screens/role_selection_screen.dart';
import '../../features/auth/screens/phone_input_screen.dart';
import '../../features/auth/screens/otp_verification_screen.dart';

import '../../features/worker/screens/worker_dashboard_screen.dart';
import '../../features/worker/screens/job_search_screen.dart';
import '../../features/worker/screens/job_detail_screen.dart';
import '../../features/worker/screens/applications_screen.dart';
import '../../features/worker/screens/worker_profile_screen.dart';
import '../../features/worker/screens/earnings_screen.dart';
import '../../features/worker/screens/worker_settings_screen.dart';

import '../../features/employer/screens/employer_dashboard_screen.dart';
import '../../features/employer/screens/employer_jobs_screen.dart';
import '../../features/employer/screens/post_job_screen.dart';
import '../../features/employer/screens/applicant_list_screen.dart';
import '../../features/employer/screens/worker_directory_screen.dart';
import '../../features/employer/screens/analytics_screen.dart';

import '../../features/customer/screens/customer_dashboard_screen.dart';
import '../../features/customer/screens/services_screen.dart';
import '../../features/customer/screens/worker_search_screen.dart';
import '../../features/customer/screens/booking_screen.dart';
import '../../features/customer/screens/bookings_list_screen.dart';
import '../../features/customer/screens/customer_profile_screen.dart';

import '../../features/shared/bottom_nav_shell.dart';

/// GoRouter configuration with role-based navigation and auth guards
final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: true,
    redirect: (context, state) {
      final isAuth = authState.isAuthenticated;
      final isAuthRoute = state.matchedLocation.startsWith('/auth');

      if (!isAuth && !isAuthRoute) return '/auth/role';
      if (isAuth && isAuthRoute) {
        return _dashboardForRole(authState.role);
      }
      return null;
    },
    routes: [
      // ─── Splash / Root Redirect ──────────
      GoRoute(
        path: '/',
        redirect: (_, s2) => '/auth/role',
      ),

      // ─── Auth Routes ─────────────────────
      GoRoute(
        path: '/auth/role',
        builder: (ctx, state) => const RoleSelectionScreen(),
      ),
      GoRoute(
        path: '/auth/phone',
        builder: (ctx, state) {
          final role = state.uri.queryParameters['role'] ?? 'worker';
          return PhoneInputScreen(role: role);
        },
      ),
      GoRoute(
        path: '/auth/otp',
        builder: (ctx, state) {
          final phone = state.uri.queryParameters['phone'] ?? '';
          final role = state.uri.queryParameters['role'] ?? 'worker';
          return OtpVerificationScreen(phone: phone, role: role);
        },
      ),

      // ─── Worker Routes ────────────────────
      ShellRoute(
        builder: (ctx, state, child) => BottomNavShell(
          role: UserRole.worker,
          currentPath: state.matchedLocation,
          child: child,
        ),
        routes: [
          GoRoute(
            path: '/worker/dashboard',
            builder: (ctx, state) => const WorkerDashboardScreen(),
          ),
          GoRoute(
            path: '/worker/jobs',
            builder: (ctx, state) => const JobSearchScreen(),
          ),
          GoRoute(
            path: '/worker/applications',
            builder: (ctx, state) => const ApplicationsScreen(),
          ),
          GoRoute(
            path: '/worker/profile',
            builder: (ctx, state) => const WorkerProfileScreen(),
          ),
          GoRoute(
            path: '/worker/earnings',
            builder: (ctx, state) => const EarningsScreen(),
          ),
          GoRoute(
            path: '/worker/settings',
            builder: (ctx, state) => const WorkerSettingsScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/worker/jobs/:id',
        builder: (ctx, state) => JobDetailScreen(jobId: state.pathParameters['id']!),
      ),

      // ─── Employer Routes ──────────────────
      ShellRoute(
        builder: (ctx, state, child) => BottomNavShell(
          role: UserRole.employer,
          currentPath: state.matchedLocation,
          child: child,
        ),
        routes: [
          GoRoute(
            path: '/employer/dashboard',
            builder: (ctx, state) => const EmployerDashboardScreen(),
          ),
          GoRoute(
            path: '/employer/jobs',
            builder: (ctx, state) => const EmployerJobsScreen(),
          ),
          GoRoute(
            path: '/employer/workers',
            builder: (ctx, state) => const WorkerDirectoryScreen(),
          ),
          GoRoute(
            path: '/employer/analytics',
            builder: (ctx, state) => const AnalyticsScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/employer/jobs/new',
        builder: (ctx, state) => const PostJobScreen(),
      ),
      GoRoute(
        path: '/employer/jobs/:id/applicants',
        builder: (ctx, state) => ApplicantListScreen(
          jobId: state.pathParameters['id']!,
        ),
      ),

      // ─── Customer Routes ──────────────────
      ShellRoute(
        builder: (ctx, state, child) => BottomNavShell(
          role: UserRole.customer,
          currentPath: state.matchedLocation,
          child: child,
        ),
        routes: [
          GoRoute(
            path: '/customer/dashboard',
            builder: (ctx, state) => const CustomerDashboardScreen(),
          ),
          GoRoute(
            path: '/customer/services',
            builder: (ctx, state) => const ServicesScreen(),
          ),
          GoRoute(
            path: '/customer/bookings',
            builder: (ctx, state) => const BookingsListScreen(),
          ),
          GoRoute(
            path: '/customer/profile',
            builder: (ctx, state) => const CustomerProfileScreen(),
          ),
        ],
      ),
      GoRoute(
        path: '/customer/workers',
        builder: (ctx, state) => const WorkerSearchScreen(),
      ),
      GoRoute(
        path: '/customer/book/:id',
        builder: (ctx, state) => BookingScreen(
          workerId: state.pathParameters['id']!,
        ),
      ),
    ],
  );
});

String _dashboardForRole(UserRole? role) {
  switch (role) {
    case UserRole.worker: return '/worker/dashboard';
    case UserRole.employer: return '/employer/dashboard';
    case UserRole.customer: return '/customer/dashboard';
    default: return '/worker/dashboard';
  }
}
