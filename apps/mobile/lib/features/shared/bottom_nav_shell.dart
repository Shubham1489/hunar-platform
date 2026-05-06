import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../core/auth/auth_provider.dart';
import '../../core/theme/app_colors.dart';

/// Shared bottom navigation shell — configures tabs per role
class BottomNavShell extends StatelessWidget {
  final UserRole role;
  final String currentPath;
  final Widget child;

  const BottomNavShell({
    super.key,
    required this.role,
    required this.currentPath,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    final tabs = _tabsForRole(role);
    final currentIndex = _getCurrentIndex(tabs, currentPath);

    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: List.generate(tabs.length, (i) {
                final tab = tabs[i];
                final isActive = i == currentIndex;
                final accentColor = _accentForRole(role);

                return GestureDetector(
                  onTap: () => context.go(tab.path),
                  behavior: HitTestBehavior.opaque,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: EdgeInsets.symmetric(
                      horizontal: isActive ? 16 : 12,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: isActive
                          ? accentColor.withValues(alpha: 0.1)
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          tab.icon,
                          size: 22,
                          color: isActive ? accentColor : AppColors.textTertiary,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          tab.label,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                            color: isActive ? accentColor : AppColors.textTertiary,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
      ),
    );
  }

  int _getCurrentIndex(List<_NavTab> tabs, String path) {
    for (int i = 0; i < tabs.length; i++) {
      if (path.startsWith(tabs[i].path)) return i;
    }
    return 0;
  }

  Color _accentForRole(UserRole role) {
    switch (role) {
      case UserRole.worker: return AppColors.workerAccent;
      case UserRole.employer: return AppColors.employerAccent;
      case UserRole.customer: return AppColors.customerAccent;
      default: return AppColors.primary;
    }
  }

  List<_NavTab> _tabsForRole(UserRole role) {
    switch (role) {
      case UserRole.worker:
        return [
          _NavTab(LucideIcons.layoutDashboard, 'Home', '/worker/dashboard'),
          _NavTab(LucideIcons.briefcase, 'Jobs', '/worker/jobs'),
          _NavTab(LucideIcons.fileText, 'Applied', '/worker/applications'),
          _NavTab(LucideIcons.wallet, 'Earnings', '/worker/earnings'),
          _NavTab(LucideIcons.user, 'Profile', '/worker/profile'),
        ];
      case UserRole.employer:
        return [
          _NavTab(LucideIcons.layoutDashboard, 'Home', '/employer/dashboard'),
          _NavTab(LucideIcons.briefcase, 'Jobs', '/employer/jobs'),
          _NavTab(LucideIcons.users, 'Workers', '/employer/workers'),
          _NavTab(LucideIcons.chartBar, 'Analytics', '/employer/analytics'),
        ];
      case UserRole.customer:
        return [
          _NavTab(LucideIcons.layoutDashboard, 'Home', '/customer/dashboard'),
          _NavTab(LucideIcons.grid3x3, 'Services', '/customer/services'),
          _NavTab(LucideIcons.calendar, 'Bookings', '/customer/bookings'),
          _NavTab(LucideIcons.user, 'Profile', '/customer/profile'),
        ];
      default:
        return [];
    }
  }
}

class _NavTab {
  final IconData icon;
  final String label;
  final String path;
  const _NavTab(this.icon, this.label, this.path);
}
