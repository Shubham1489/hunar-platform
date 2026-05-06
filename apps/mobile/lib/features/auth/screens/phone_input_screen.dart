import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/theme/app_colors.dart';

/// Phone number input screen — step 2 of auth flow
class PhoneInputScreen extends ConsumerStatefulWidget {
  final String role;
  const PhoneInputScreen({super.key, required this.role});

  @override
  ConsumerState<PhoneInputScreen> createState() => _PhoneInputScreenState();
}

class _PhoneInputScreenState extends ConsumerState<PhoneInputScreen> {
  final _phoneController = TextEditingController();
  final _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 300), () {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _handleSubmit() {
    final phone = _phoneController.text.trim();
    if (phone.length != 10) return;

    ref.read(authProvider.notifier).requestOtp(phone);
    context.go('/auth/otp?phone=$phone&role=${widget.role}');
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
              // Back button
              IconButton(
                onPressed: () => context.go('/auth/role'),
                icon: const Icon(LucideIcons.arrowLeft),
                style: IconButton.styleFrom(
                  backgroundColor: AppColors.surface2,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),

              const SizedBox(height: 40),

              Text(
                'Enter your phone',
                style: Theme.of(context).textTheme.displaySmall,
              ),
              const SizedBox(height: 8),
              Text(
                'We\'ll send you a 6-digit OTP to verify',
                style: Theme.of(context).textTheme.bodyMedium,
              ),

              const SizedBox(height: 32),

              // Phone input
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.surface1,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.surface3),
                ),
                child: Row(
                  children: [
                    Text(
                      '🇮🇳 +91',
                      style: TextStyle(
                        fontSize: 16, fontWeight: FontWeight.w600,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Container(width: 1, height: 28, color: AppColors.surface3),
                    const SizedBox(width: 12),
                    Expanded(
                      child: TextField(
                        controller: _phoneController,
                        focusNode: _focusNode,
                        keyboardType: TextInputType.phone,
                        maxLength: 10,
                        style: const TextStyle(
                          fontSize: 18, fontWeight: FontWeight.w600,
                          letterSpacing: 2,
                        ),
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        decoration: const InputDecoration(
                          hintText: 'Enter 10-digit number',
                          counterText: '',
                          border: InputBorder.none,
                          enabledBorder: InputBorder.none,
                          focusedBorder: InputBorder.none,
                          fillColor: Colors.transparent,
                          filled: true,
                        ),
                        onChanged: (_) => setState(() {}),
                        onSubmitted: (_) => _handleSubmit(),
                      ),
                    ),
                  ],
                ),
              ),

              if (auth.error != null) ...[
                const SizedBox(height: 12),
                Text(
                  auth.error!,
                  style: const TextStyle(color: AppColors.error, fontSize: 13),
                ),
              ],

              const SizedBox(height: 24),

              // Submit button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _phoneController.text.length == 10
                      ? _handleSubmit : null,
                  child: auth.isLoading
                      ? const SizedBox(
                          width: 22, height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white,
                          ),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Get OTP'),
                            SizedBox(width: 8),
                            Icon(LucideIcons.arrowRight, size: 18),
                          ],
                        ),
                ),
              ),

              const SizedBox(height: 16),
              Text(
                'By continuing, you agree to our Terms of Service and Privacy Policy',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: AppColors.textTertiary, fontSize: 12,
                ),
              ),

              const Spacer(),

              // Trust badges
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _TrustBadge(icon: LucideIcons.shieldCheck, text: 'Verified'),
                  const SizedBox(width: 24),
                  _TrustBadge(icon: LucideIcons.sparkles, text: 'AI Powered'),
                  const SizedBox(width: 24),
                  _TrustBadge(icon: LucideIcons.star, text: '4.8★'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TrustBadge extends StatelessWidget {
  final IconData icon;
  final String text;
  const _TrustBadge({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.success),
        const SizedBox(width: 4),
        Text(text, style: TextStyle(
          color: AppColors.textTertiary, fontSize: 12,
          fontWeight: FontWeight.w500,
        )),
      ],
    );
  }
}
