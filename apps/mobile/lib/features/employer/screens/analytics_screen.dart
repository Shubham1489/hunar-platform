import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Employer analytics dashboard
class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Analytics')),
      body: SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(
        crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            _Stat(label: 'Total Hires', value: '48', icon: LucideIcons.userCheck, color: AppColors.success),
            const SizedBox(width: 12),
            _Stat(label: 'Active Jobs', value: '5', icon: LucideIcons.briefcase, color: AppColors.employerAccent),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _Stat(label: 'Applicants', value: '234', icon: LucideIcons.users, color: AppColors.primaryLight),
            const SizedBox(width: 12),
            _Stat(label: 'Fill Rate', value: '87%', icon: LucideIcons.target, color: AppColors.warning),
          ]),

          const SizedBox(height: 24),

          Text('Hiring Funnel', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          ..._funnelStages.map((stage) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                Text(stage.label, style: Theme.of(context).textTheme.bodySmall),
                Text(stage.count.toString(), style: Theme.of(context).textTheme.titleSmall),
              ]),
              const SizedBox(height: 4),
              ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: LinearProgressIndicator(
                  value: stage.width,
                  minHeight: 10,
                  backgroundColor: AppColors.surface2,
                  valueColor: const AlwaysStoppedAnimation(AppColors.employerAccent),
                ),
              ),
            ]),
          )),

          const SizedBox(height: 24),

          Text('Top Skills in Demand', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          ..._topSkills.map((skill) => Container(
            margin: const EdgeInsets.only(bottom: 8),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
            child: Row(children: [
              Text(skill.name, style: Theme.of(context).textTheme.titleSmall),
              const Spacer(),
              Text('${skill.count} jobs', style: Theme.of(context).textTheme.bodySmall),
            ]),
          )),
        ],
      )),
    );
  }
}

class _Stat extends StatelessWidget {
  final String label, value; final IconData icon; final Color color;
  const _Stat({required this.label, required this.value, required this.icon, required this.color});
  @override
  Widget build(BuildContext context) {
    return Expanded(child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(16)),
      child: Row(children: [
        Icon(icon, size: 20, color: color),
        const SizedBox(width: 12),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: color)),
          Text(label, style: TextStyle(fontSize: 11, color: color.withValues(alpha: 0.7))),
        ]),
      ]),
    ));
  }
}

class _FunnelStage {
  final String label;
  final int count;
  final double width;
  const _FunnelStage(this.label, this.count, this.width);
}

class _SkillDemand {
  final String name;
  final int count;
  const _SkillDemand(this.name, this.count);
}

final _funnelStages = [
  const _FunnelStage('Applied', 234, 1.0),
  const _FunnelStage('Shortlisted', 89, 0.6),
  const _FunnelStage('Interviewed', 52, 0.35),
  const _FunnelStage('Hired', 48, 0.25),
];

final _topSkills = [
  const _SkillDemand('Electrician', 24),
  const _SkillDemand('Plumber', 18),
  const _SkillDemand('Carpenter', 15),
  const _SkillDemand('AC Technician', 12),
];
