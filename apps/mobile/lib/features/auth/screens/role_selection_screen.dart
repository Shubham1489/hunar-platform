import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Role selection screen — first screen in auth flow
class RoleSelectionScreen extends StatelessWidget {
  const RoleSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(gradient: AppColors.heroGradient),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 40),

                // Logo
                Row(
                  children: [
                    Container(
                      width: 44, height: 44,
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Center(
                        child: Text('H', style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.w800,
                          fontSize: 22,
                        )),
                      ),
                    ),
                    const SizedBox(width: 10),
                    const Text('Hunar', style: TextStyle(
                      color: Colors.white, fontWeight: FontWeight.w800,
                      fontSize: 26,
                    )),
                  ],
                ),

                const SizedBox(height: 48),

                // Title
                Text(
                  'Welcome to the\nFuture of',
                  style: Theme.of(context).textTheme.displayMedium?.copyWith(
                    color: Colors.white,
                    height: 1.2,
                  ),
                ),
                ShaderMask(
                  shaderCallback: (bounds) => const LinearGradient(
                    colors: [Color(0xFFF97316), Color(0xFFFBBF24)],
                  ).createShader(bounds),
                  child: Text(
                    'Skilled Work',
                    style: Theme.of(context).textTheme.displayMedium?.copyWith(
                      color: Colors.white,
                      height: 1.2,
                    ),
                  ),
                ),

                const SizedBox(height: 16),
                Text(
                  'India\'s most trusted blue-collar job platform\npowered by AI',
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.6),
                    fontSize: 15, height: 1.5,
                  ),
                ),

                const Spacer(),

                // Role Cards
                _RoleCard(
                  icon: LucideIcons.wrench,
                  title: 'Worker',
                  subtitle: 'Find jobs & earn daily',
                  color: AppColors.primaryLight,
                  onTap: () => context.go('/auth/phone?role=worker'),
                ),
                const SizedBox(height: 12),
                _RoleCard(
                  icon: LucideIcons.briefcase,
                  title: 'Employer',
                  subtitle: 'Hire skilled workers',
                  color: AppColors.employerAccent,
                  onTap: () => context.go('/auth/phone?role=employer'),
                ),
                const SizedBox(height: 12),
                _RoleCard(
                  icon: LucideIcons.house,
                  title: 'Customer',
                  subtitle: 'Book home services',
                  color: AppColors.customerAccent,
                  onTap: () => context.go('/auth/phone?role=customer'),
                ),

                const SizedBox(height: 32),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;

  const _RoleCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withValues(alpha: 0.08),
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Row(
            children: [
              Container(
                width: 48, height: 48,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(title, style: const TextStyle(
                      color: Colors.white, fontWeight: FontWeight.w700,
                      fontSize: 16,
                    )),
                    const SizedBox(height: 2),
                    Text(subtitle, style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.5),
                      fontSize: 13,
                    )),
                  ],
                ),
              ),
              Icon(LucideIcons.arrowRight, color: Colors.white.withValues(alpha: 0.4), size: 20),
            ],
          ),
        ),
      ),
    );
  }
}
