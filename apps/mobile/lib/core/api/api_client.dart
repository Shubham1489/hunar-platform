import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'api_endpoints.dart';

/// Dio-based API client with JWT auth interceptor and token refresh.
/// All API calls flow through this single client.
final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

class ApiClient {
  late final Dio dio;
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  static const String _tokenKey = 'hunar_token';
  static const String _refreshTokenKey = 'hunar_refresh_token';

  ApiClient() {
    dio = Dio(BaseOptions(
      baseUrl: ApiEndpoints.baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {'Content-Type': 'application/json'},
    ));

    // ─── Request Interceptor: Attach JWT ─────
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _secureStorage.read(key: _tokenKey);
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },

      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          // Try to refresh the token
          final refreshed = await _refreshToken();
          if (refreshed) {
            // Retry the original request
            final token = await _secureStorage.read(key: _tokenKey);
            error.requestOptions.headers['Authorization'] = 'Bearer $token';
            try {
              final response = await dio.fetch(error.requestOptions);
              return handler.resolve(response);
            } catch (e) {
              return handler.next(error);
            }
          }
        }
        return handler.next(error);
      },
    ));

    // ─── Logging Interceptor (debug only) ────
    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      logPrint: (obj) {
        // Use print in debug mode only
        assert(() {
          // ignore: avoid_print
          print(obj);
          return true;
        }());
      },
    ));
  }

  /// Refresh the access token using the stored refresh token
  Future<bool> _refreshToken() async {
    try {
      final refreshToken = await _secureStorage.read(key: _refreshTokenKey);
      if (refreshToken == null) return false;

      final response = await Dio(BaseOptions(
        baseUrl: ApiEndpoints.baseUrl,
      )).post(ApiEndpoints.authRefresh, data: {
        'refreshToken': refreshToken,
      });

      final newToken = response.data['accessToken'];
      final newRefresh = response.data['refreshToken'];

      await _secureStorage.write(key: _tokenKey, value: newToken);
      if (newRefresh != null) {
        await _secureStorage.write(key: _refreshTokenKey, value: newRefresh);
      }

      return true;
    } catch (e) {
      // Refresh failed — clear tokens
      await clearTokens();
      return false;
    }
  }

  /// Save JWT tokens after login
  Future<void> saveTokens(String accessToken, String refreshToken) async {
    await _secureStorage.write(key: _tokenKey, value: accessToken);
    await _secureStorage.write(key: _refreshTokenKey, value: refreshToken);
  }

  /// Clear all stored tokens (logout)
  Future<void> clearTokens() async {
    await _secureStorage.delete(key: _tokenKey);
    await _secureStorage.delete(key: _refreshTokenKey);
  }

  /// Check if user has stored tokens
  Future<bool> hasTokens() async {
    final token = await _secureStorage.read(key: _tokenKey);
    return token != null;
  }
}
