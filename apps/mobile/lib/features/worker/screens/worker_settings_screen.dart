import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/auth/auth_provider.dart';
import '../../../core/theme/app_colors.dart';

/// Worker settings screen
class WorkerSettingsScreen extends ConsumerWidget {
  const WorkerSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _Section(title: 'Account', children: [
            _SettingsTile(icon: LucideIcons.user, title: 'Edit Profile', onTap: () => context.go('/worker/profile')),
            _SettingsTile(icon: LucideIcons.languages, title: 'Language', trailing: 'English'),
            _SettingsTile(icon: LucideIcons.moon, title: 'Dark Mode', trailing: 'Off'),
          ]),
          const SizedBox(height: 20),
          _Section(title: 'Notifications', children: [
            _SettingsTile(icon: LucideIcons.bell, title: 'Push Notifications', isSwitch: true, switchValue: true),
            _SettingsTile(icon: LucideIcons.messageSquare, title: 'SMS Alerts', isSwitch: true, switchValue: false),
            _SettingsTile(icon: LucideIcons.briefcase, title: 'Job Alerts', isSwitch: true, switchValue: true),
          ]),
          const SizedBox(height: 20),
          _Section(title: 'Security', children: [
            _SettingsTile(icon: LucideIcons.shieldCheck, title: 'Verify Aadhaar'),
            _SettingsTile(icon: LucideIcons.lock, title: 'Change PIN'),
          ]),
          const SizedBox(height: 20),
          _Section(title: 'Support', children: [
            _SettingsTile(icon: LucideIcons.info, title: 'Help & FAQ'),
            _SettingsTile(icon: LucideIcons.fileText, title: 'Terms of Service'),
            _SettingsTile(icon: LucideIcons.shield, title: 'Privacy Policy'),
          ]),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {
                ref.read(authProvider.notifier).logout();
                context.go('/auth/role');
              },
              icon: const Icon(LucideIcons.logOut, size: 18, color: AppColors.error),
              label: const Text('Logout', style: TextStyle(color: AppColors.error)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: AppColors.error),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Center(child: Text('v1.0.0', style: Theme.of(context).textTheme.bodySmall)),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  final String title;
  final List<Widget> children;
  const _Section({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(title, style: Theme.of(context).textTheme.titleMedium),
      const SizedBox(height: 8),
      Container(
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Column(children: children),
      ),
    ]);
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String? trailing;
  final bool isSwitch;
  final bool switchValue;
  final VoidCallback? onTap;

  const _SettingsTile({
    required this.icon, required this.title,
    this.trailing, this.isSwitch = false, this.switchValue = false,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, size: 20, color: AppColors.textSecondary),
      title: Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
      trailing: isSwitch
          ? Switch.adaptive(value: switchValue, onChanged: (_) {})
          : trailing != null
              ? Text(trailing!, style: Theme.of(context).textTheme.bodySmall)
              : const Icon(LucideIcons.chevronRight, size: 18, color: AppColors.textTertiary),
      onTap: onTap,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
    );
  }
}
