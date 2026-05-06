import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// AI-ranked applicant list for a job
class ApplicantListScreen extends StatelessWidget {
  final String jobId;
  const ApplicantListScreen({super.key, required this.jobId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Applicants'), actions: [
        Padding(padding: const EdgeInsets.only(right: 16), child: Row(children: [
          Icon(LucideIcons.sparkles, size: 16, color: AppColors.employerAccent),
          const SizedBox(width: 4),
          Text('AI Ranked', style: TextStyle(color: AppColors.employerAccent, fontSize: 13, fontWeight: FontWeight.w600)),
        ])),
      ]),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _applicants.length,
        itemBuilder: (_, i) {
          final a = _applicants[i];
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)]),
            child: Column(children: [
              Row(children: [
                CircleAvatar(radius: 24, backgroundColor: AppColors.surface2,
                  child: Text(a.name[0], style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18))),
                const SizedBox(width: 14),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(a.name, style: Theme.of(context).textTheme.titleSmall),
                  Row(children: [
                    Text('${a.exp} yrs exp', style: Theme.of(context).textTheme.bodySmall),
                    const SizedBox(width: 8),
                    Text('${a.rating}★', style: TextStyle(color: AppColors.warning, fontSize: 12, fontWeight: FontWeight.w600)),
                  ]),
                ])),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: _matchColor(a.score).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                  child: Column(children: [
                    Icon(LucideIcons.sparkles, size: 14, color: _matchColor(a.score)),
                    Text('${a.score}%', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800, color: _matchColor(a.score))),
                  ]),
                ),
              ]),
              const SizedBox(height: 12),
              Wrap(spacing: 6, children: a.skills.map((s) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: AppColors.surface2, borderRadius: BorderRadius.circular(6)),
                child: Text(s, style: const TextStyle(fontSize: 11)),
              )).toList()),
              const SizedBox(height: 12),
              Row(children: [
                Expanded(child: OutlinedButton(onPressed: () {}, child: const Text('Reject'))),
                const SizedBox(width: 12),
                Expanded(child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.success),
                  child: const Text('Shortlist'),
                )),
              ]),
            ]),
          );
        },
      ),
    );
  }

  Color _matchColor(int m) => m >= 80 ? AppColors.success : m >= 50 ? AppColors.warning : AppColors.textTertiary;
}

class _Applicant {
  final String name;
  final int exp, score;
  final double rating;
  final List<String> skills;
  const _Applicant({required this.name, required this.exp, required this.rating, required this.score, required this.skills});
}

final _applicants = [
  const _Applicant(name: 'Suresh Kumar', exp: 5, rating: 4.9, score: 95, skills: ['Wiring', 'Panel Board', 'MCB']),
  const _Applicant(name: 'Amit Patel', exp: 3, rating: 4.7, score: 88, skills: ['Wiring', 'Earthing']),
  const _Applicant(name: 'Ravi Mishra', exp: 2, rating: 4.5, score: 76, skills: ['MCB', 'Cable Tray']),
  const _Applicant(name: 'Deepak Singh', exp: 4, rating: 4.3, score: 64, skills: ['Wiring']),
];
