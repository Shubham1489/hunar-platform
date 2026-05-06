import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/auth/auth_provider.dart';

/// Employer Dashboard
class EmployerDashboardScreen extends ConsumerWidget {
  const EmployerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final name = (auth.user?['name'] as String?) ?? 'Employer';

    return Scaffold(
      body: SafeArea(child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            CircleAvatar(radius: 24, backgroundColor: AppColors.employerAccent.withValues(alpha: 0.1),
              child: Text(name[0].toUpperCase(), style: const TextStyle(
                fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.employerAccent))),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Dashboard', style: Theme.of(context).textTheme.bodySmall),
              Text(name, style: Theme.of(context).textTheme.headlineSmall),
            ])),
            IconButton(onPressed: () {}, icon: const Icon(LucideIcons.bell, size: 22)),
          ]),

          const SizedBox(height: 24),

          Container(
            width: double.infinity, padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(gradient: AppColors.employerGradient, borderRadius: BorderRadius.circular(20)),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Hiring Overview', style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 13)),
              const SizedBox(height: 8),
              Row(children: const [
                _Stat(label: 'Active Jobs', value: '5'),
                SizedBox(width: 24),
                _Stat(label: 'Applicants', value: '47'),
                SizedBox(width: 24),
                _Stat(label: 'Hired', value: '12'),
              ]),
            ]),
          ),

          const SizedBox(height: 24),

          Row(children: [
            _ActionCard(icon: LucideIcons.plus, label: 'Post Job', color: AppColors.employerAccent,
              onTap: () => context.go('/employer/jobs/new')),
            const SizedBox(width: 12),
            _ActionCard(icon: LucideIcons.users, label: 'Find Workers', color: AppColors.primaryLight,
              onTap: () => context.go('/employer/workers')),
            const SizedBox(width: 12),
            _ActionCard(icon: LucideIcons.chartBar, label: 'Analytics', color: AppColors.success,
              onTap: () => context.go('/employer/analytics')),
          ]),

          const SizedBox(height: 24),

          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text('Recent Applicants', style: Theme.of(context).textTheme.titleLarge),
            TextButton(onPressed: () => context.go('/employer/jobs'), child: const Text('View All')),
          ]),
          const SizedBox(height: 8),

          ..._recentApplicants.map((a) => Container(
            margin: const EdgeInsets.only(bottom: 10),
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)]),
            child: Row(children: [
              CircleAvatar(radius: 20, backgroundColor: AppColors.surface2,
                child: Text(a.name[0], style: const TextStyle(fontWeight: FontWeight.w700))),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(a.name, style: Theme.of(context).textTheme.titleSmall),
                Text('${a.job} • ${a.match}% match', style: Theme.of(context).textTheme.bodySmall),
              ])),
              Row(children: [
                IconButton(onPressed: () {}, icon: const Icon(LucideIcons.check, size: 18, color: AppColors.success)),
                IconButton(onPressed: () {}, icon: const Icon(LucideIcons.x, size: 18, color: AppColors.error)),
              ]),
            ]),
          )),
        ]),
      )),
    );
  }
}

class _Stat extends StatelessWidget {
  final String label, value;
  const _Stat({required this.label, required this.value});
  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 11)),
      const SizedBox(height: 2),
      Text(value, style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800)),
    ]);
  }
}

class _ActionCard extends StatelessWidget {
  final IconData icon; final String label; final Color color; final VoidCallback onTap;
  const _ActionCard({required this.icon, required this.label, required this.color, required this.onTap});
  @override
  Widget build(BuildContext context) {
    return Expanded(child: GestureDetector(onTap: onTap, child: Container(
      padding: const EdgeInsets.symmetric(vertical: 18),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(16)),
      child: Column(children: [
        Icon(icon, color: color, size: 24), const SizedBox(height: 6),
        Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: color)),
      ]),
    )));
  }
}

class _RecentApplicant {
  final String name, job;
  final int match;
  const _RecentApplicant({required this.name, required this.job, required this.match});
}

final _recentApplicants = [
  const _RecentApplicant(name: 'Suresh K', job: 'Electrician', match: 95),
  const _RecentApplicant(name: 'Amit P', job: 'Electrician', match: 88),
  const _RecentApplicant(name: 'Ravi M', job: 'Plumber', match: 76),
];
