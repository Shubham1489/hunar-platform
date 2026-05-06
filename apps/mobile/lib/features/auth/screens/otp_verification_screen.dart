import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/theme/app_colors.dart';

/// OTP verification screen — step 3 of auth flow
class OtpVerificationScreen extends ConsumerStatefulWidget {
  final String phone;
  final String role;
  const OtpVerificationScreen({super.key, required this.phone, required this.role});

  @override
  ConsumerState<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends ConsumerState<OtpVerificationScreen> {
  final List<TextEditingController> _controllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());
  Timer? _timer;
  int _countdown = 30;
  bool _canResend = false;

  @override
  void initState() {
    super.initState();
    _startCountdown();
    Future.delayed(const Duration(milliseconds: 300), () {
      _focusNodes[0].requestFocus();
    });
  }

  void _startCountdown() {
    _countdown = 30;
    _canResend = false;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          if (_countdown > 0) {
            _countdown--;
          } else {
            _canResend = true;
            timer.cancel();
          }
        });
      }
    });
  }

  String get _otpCode => _controllers.map((c) => c.text).join();

  void _handleVerify() async {
    if (_otpCode.length != 6) return;

    final role = switch (widget.role.toLowerCase()) {
      'employer' => UserRole.employer,
      'customer' => UserRole.customer,
      _ => UserRole.worker,
    };

    final success = await ref.read(authProvider.notifier).verifyOtp(
      widget.phone, _otpCode, role,
    );

    if (success && mounted) {
      final authState = ref.read(authProvider);
      switch (authState.role) {
        case UserRole.worker:
          context.go('/worker/dashboard');
          break;
        case UserRole.employer:
          context.go('/employer/dashboard');
          break;
        case UserRole.customer:
          context.go('/customer/dashboard');
          break;
        default:
          context.go('/worker/dashboard');
      }
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    for (var c in _controllers) { c.dispose(); }
    for (var f in _focusNodes) { f.dispose(); }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              IconButton(
                onPressed: () => context.go('/auth/phone?role=${widget.role}'),
                icon: const Icon(LucideIcons.arrowLeft),
                style: IconButton.styleFrom(
                  backgroundColor: AppColors.surface2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),

              const SizedBox(height: 40),

              Text('Verify OTP', style: Theme.of(context).textTheme.displaySmall),
              const SizedBox(height: 8),
              RichText(
                text: TextSpan(
                  style: Theme.of(context).textTheme.bodyMedium,
                  children: [
                    const TextSpan(text: 'Enter the 6-digit code sent to '),
                    TextSpan(
                      text: '+91 ${widget.phone}',
                      style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.textPrimary),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 40),

              // OTP Input boxes
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(6, (i) => SizedBox(
                  width: 48,
                  child: TextField(
                    controller: _controllers[i],
                    focusNode: _focusNodes[i],
                    textAlign: TextAlign.center,
                    keyboardType: TextInputType.number,
                    maxLength: 1,
                    style: const TextStyle(
                      fontSize: 24, fontWeight: FontWeight.w800,
                    ),
                    inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                    decoration: InputDecoration(
                      counterText: '',
                      contentPadding: const EdgeInsets.symmetric(vertical: 16),
                      filled: true,
                      fillColor: _controllers[i].text.isNotEmpty
                          ? AppColors.primary.withValues(alpha: 0.05)
                          : AppColors.surface1,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: _controllers[i].text.isNotEmpty
                              ? AppColors.primary : AppColors.surface3,
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppColors.primary, width: 2),
                      ),
                    ),
                    onChanged: (value) {
                      setState(() {});
                      if (value.isNotEmpty && i < 5) {
                        _focusNodes[i + 1].requestFocus();
                      }
                      if (value.isEmpty && i > 0) {
                        _focusNodes[i - 1].requestFocus();
                      }
                      if (_otpCode.length == 6) {
                        _handleVerify();
                      }
                    },
                  ),
                )),
              ),

              if (auth.error != null) ...[
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.error.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(LucideIcons.circleAlert, color: AppColors.error, size: 18),
                      const SizedBox(width: 8),
                      Expanded(child: Text(
                        auth.error!,
                        style: const TextStyle(color: AppColors.error, fontSize: 13),
                      )),
                    ],
                  ),
                ),
              ],

              const SizedBox(height: 32),

              // Verify button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _otpCode.length == 6 && !auth.isLoading
                      ? _handleVerify : null,
                  child: auth.isLoading
                      ? const SizedBox(
                          width: 22, height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white,
                          ),
                        )
                      : const Text('Verify & Continue'),
                ),
              ),

              const SizedBox(height: 24),

              // Resend
              Center(
                child: _canResend
                    ? TextButton(
                        onPressed: () {
                          ref.read(authProvider.notifier).requestOtp(widget.phone);
                          _startCountdown();
                        },
                        child: const Text('Resend OTP'),
                      )
                    : Text(
                        'Resend in ${_countdown}s',
                        style: TextStyle(color: AppColors.textTertiary, fontSize: 14),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
