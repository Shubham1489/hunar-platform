import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/api_client.dart';
import '../api/api_endpoints.dart';

/// User roles in the Hunar platform
enum UserRole { worker, employer, customer, admin }

/// Auth state model
class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;
  final UserRole? role;
  final Map<String, dynamic>? user;
  final bool otpSent;
  final String? otpPhone;

  const AuthState({
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
    this.role,
    this.user,
    this.otpSent = false,
    this.otpPhone,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
    UserRole? role,
    Map<String, dynamic>? user,
    bool? otpSent,
    String? otpPhone,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      role: role ?? this.role,
      user: user ?? this.user,
      otpSent: otpSent ?? this.otpSent,
      otpPhone: otpPhone ?? this.otpPhone,
    );
  }
}

/// Auth state notifier — manages OTP flow, JWT session, and user profile
class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() => const AuthState();

  ApiClient get _api => ref.read(apiClientProvider);

  /// Request OTP for phone number
  Future<void> requestOtp(String phone) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _api.dio.post(ApiEndpoints.authRequestOtp, data: {
        'phone': phone,
      });
      state = state.copyWith(
        isLoading: false,
        otpSent: true,
        otpPhone: phone,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: _extractError(e),
      );
    }
  }

  /// Verify OTP and login/register
  Future<bool> verifyOtp(String phone, String otp, UserRole role) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final response = await _api.dio.post(ApiEndpoints.authVerifyOtp, data: {
        'phone': phone,
        'otp': otp,
        'role': role.name.toUpperCase(),
      });

      final data = response.data;
      final accessToken = data['accessToken'] as String;
      final refreshToken = data['refreshToken'] as String;
      final user = data['user'] as Map<String, dynamic>;

      await _api.saveTokens(accessToken, refreshToken);

      state = AuthState(
        isAuthenticated: true,
        role: _parseRole(user['role'] as String?),
        user: user,
      );
      return true;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: _extractError(e),
      );
      return false;
    }
  }

  /// Fetch current user profile
  Future<void> fetchUser() async {
    try {
      final response = await _api.dio.get(ApiEndpoints.authMe);
      final user = response.data['user'] as Map<String, dynamic>;
      state = state.copyWith(
        isAuthenticated: true,
        user: user,
        role: _parseRole(user['role'] as String?),
      );
    } catch (e) {
      // Token invalid
      state = const AuthState();
    }
  }

  /// Check stored session on app start
  Future<void> checkSession() async {
    final hasTokens = await _api.hasTokens();
    if (hasTokens) {
      await fetchUser();
    }
  }

  /// Logout
  Future<void> logout() async {
    try {
      await _api.dio.post(ApiEndpoints.authLogout);
    } catch (_) {}
    await _api.clearTokens();
    state = const AuthState();
  }

  void clearError() => state = state.copyWith(error: null);

  UserRole _parseRole(String? role) {
    switch (role?.toUpperCase()) {
      case 'WORKER': return UserRole.worker;
      case 'EMPLOYER': return UserRole.employer;
      case 'CUSTOMER': return UserRole.customer;
      case 'ADMIN': return UserRole.admin;
      default: return UserRole.worker;
    }
  }

  String _extractError(dynamic e) {
    if (e is Exception) {
      return e.toString().replaceAll('Exception: ', '');
    }
    return 'Something went wrong';
  }
}

/// Riverpod providers
final authProvider = NotifierProvider<AuthNotifier, AuthState>(AuthNotifier.new);
