import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/auth/auth_provider.dart';

/// Worker Dashboard — main home screen after login
class WorkerDashboardScreen extends ConsumerWidget {
  const WorkerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final name = (auth.user?['name'] as String?) ?? 'Worker';

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(children: [
                CircleAvatar(radius: 24, backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                  child: Text(name[0].toUpperCase(), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.primary))),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Good ${_getGreeting()}! 👋', style: Theme.of(context).textTheme.bodySmall),
                  Text(name, style: Theme.of(context).textTheme.headlineSmall),
                ])),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: AppColors.success.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
                  child: const Row(children: [
                    Icon(LucideIcons.circle, size: 8, color: AppColors.success),
                    SizedBox(width: 6),
                    Text('Available', style: TextStyle(color: AppColors.success, fontSize: 12, fontWeight: FontWeight.w600)),
                  ]),
                ),
                const SizedBox(width: 8),
                IconButton(onPressed: () => context.go('/worker/settings'), icon: const Icon(LucideIcons.settings, size: 22)),
              ]),

              const SizedBox(height: 24),

              // Earnings Card
              Container(
                width: double.infinity, padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(gradient: AppColors.workerGradient, borderRadius: BorderRadius.circular(20)),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text('Total Earnings', style: TextStyle(color: Colors.white.withValues(alpha: 0.7), fontSize: 13)),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
                      child: const Text('This Month', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w500)),
                    ),
                  ]),
                  const SizedBox(height: 8),
                  const Text('₹45,200', style: TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 16),
                  Row(children: const [
                    _EarningsStat(label: 'Pending', value: '₹8,500'),
                    SizedBox(width: 24),
                    _EarningsStat(label: 'Jobs Done', value: '23'),
                    SizedBox(width: 24),
                    _EarningsStat(label: 'Rating', value: '4.8★'),
                  ]),
                ]),
              ),

              const SizedBox(height: 24),

              // Quick Actions
              Text('Quick Actions', style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 12),
              Row(children: [
                _QuickAction(icon: LucideIcons.search, label: 'Find Jobs', color: AppColors.primaryLight, onTap: () => context.go('/worker/jobs')),
                const SizedBox(width: 12),
                _QuickAction(icon: LucideIcons.fileText, label: 'Applications', color: AppColors.secondary, onTap: () => context.go('/worker/applications')),
                const SizedBox(width: 12),
                _QuickAction(icon: LucideIcons.wallet, label: 'Earnings', color: AppColors.success, onTap: () => context.go('/worker/earnings')),
                const SizedBox(width: 12),
                _QuickAction(icon: LucideIcons.mic, label: 'Voice Skill', color: AppColors.employerAccent, onTap: () => context.go('/worker/profile')),
              ]),

              const SizedBox(height: 24),

              // AI Recommended Jobs
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Row(children: [
                  Text('AI Recommended', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(width: 6),
                  Icon(LucideIcons.sparkles, size: 18, color: AppColors.secondary),
                ]),
                TextButton(onPressed: () => context.go('/worker/jobs'), child: const Text('View All')),
              ]),
              const SizedBox(height: 8),

              ..._mockJobs.map((j) => _JobCard(job: j)),
            ],
          ),
        ),
      ),
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  }
}

class _EarningsStat extends StatelessWidget {
  final String label, value;
  const _EarningsStat({required this.label, required this.value});
  @override
  Widget build(BuildContext context) {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text(label, style: TextStyle(color: Colors.white.withValues(alpha: 0.6), fontSize: 11)),
      const SizedBox(height: 2),
      Text(value, style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
    ]);
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon; final String label; final Color color; final VoidCallback onTap;
  const _QuickAction({required this.icon, required this.label, required this.color, required this.onTap});
  @override
  Widget build(BuildContext context) {
    return Expanded(child: GestureDetector(onTap: onTap, child: Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(16)),
      child: Column(children: [
        Icon(icon, color: color, size: 24), const SizedBox(height: 6),
        Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
      ]),
    )));
  }
}

class _MockJob {
  final String title, company, location, salary;
  final int match;
  final List<String> skills;
  const _MockJob({required this.title, required this.company, required this.location, required this.salary, required this.match, required this.skills});
}

class _JobCard extends StatelessWidget {
  final _MockJob job;
  const _JobCard({required this.job});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4))]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Row(children: [
          Container(width: 44, height: 44,
            decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(12)),
            child: Center(child: Text(job.company[0], style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.primary, fontSize: 18)))),
          const SizedBox(width: 12),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(job.title, style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 2),
            Text(job.company, style: Theme.of(context).textTheme.bodySmall),
          ])),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: _matchColor(job.match).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
            child: Row(children: [
              Icon(LucideIcons.sparkles, size: 12, color: _matchColor(job.match)),
              const SizedBox(width: 4),
              Text('${job.match}%', style: TextStyle(color: _matchColor(job.match), fontSize: 12, fontWeight: FontWeight.w700)),
            ]),
          ),
        ]),
        const SizedBox(height: 12),
        Row(children: [
          Icon(LucideIcons.mapPin, size: 14, color: AppColors.textTertiary), const SizedBox(width: 4),
          Text(job.location, style: Theme.of(context).textTheme.bodySmall),
          const SizedBox(width: 16),
          Icon(LucideIcons.indianRupee, size: 14, color: AppColors.textTertiary), const SizedBox(width: 4),
          Text(job.salary, style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w600, color: AppColors.success)),
        ]),
        const SizedBox(height: 12),
        Wrap(spacing: 6, children: job.skills.map((s) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(color: AppColors.surface2, borderRadius: BorderRadius.circular(6)),
          child: Text(s, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500)),
        )).toList()),
      ]),
    );
  }

  Color _matchColor(int match) {
    if (match >= 80) return AppColors.success;
    if (match >= 50) return AppColors.warning;
    return AppColors.textTertiary;
  }
}

final _mockJobs = [
  const _MockJob(title: 'Senior Electrician', company: 'Tata Projects', location: 'Mumbai', salary: '₹800/day', match: 95, skills: ['Wiring', 'Panel Board', 'MCB']),
  const _MockJob(title: 'AC Technician', company: 'Urban Company', location: 'Pune', salary: '₹700/day', match: 88, skills: ['Split AC', 'Gas Refill', 'Installation']),
  const _MockJob(title: 'Plumber', company: 'L&T Construction', location: 'Delhi', salary: '₹650/day', match: 76, skills: ['Pipe Fitting', 'Drainage', 'Tile Work']),
];
