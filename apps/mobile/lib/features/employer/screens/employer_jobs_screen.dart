import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Employer jobs listing
class EmployerJobsScreen extends StatelessWidget {
  const EmployerJobsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Jobs')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.go('/employer/jobs/new'),
        backgroundColor: AppColors.employerAccent,
        icon: const Icon(LucideIcons.plus, color: Colors.white),
        label: const Text('Post Job', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _jobs.length,
        itemBuilder: (_, i) {
          final job = _jobs[i];
          final active = job.status == 'Active';
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)]),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Expanded(child: Text(job.title, style: Theme.of(context).textTheme.titleSmall)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: (active ? AppColors.success : AppColors.textTertiary).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6)),
                  child: Text(job.status, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700,
                    color: active ? AppColors.success : AppColors.textTertiary)),
                ),
              ]),
              const SizedBox(height: 8),
              Row(children: [
                Icon(LucideIcons.mapPin, size: 13, color: AppColors.textTertiary), const SizedBox(width: 4),
                Text(job.city, style: Theme.of(context).textTheme.bodySmall),
                const SizedBox(width: 16),
                Icon(LucideIcons.users, size: 13, color: AppColors.textTertiary), const SizedBox(width: 4),
                Text('${job.applicants} applicants', style: Theme.of(context).textTheme.bodySmall),
              ]),
              const SizedBox(height: 8),
              Row(children: [
                Text(job.salary, style: TextStyle(color: AppColors.success, fontWeight: FontWeight.w700, fontSize: 14)),
                const Spacer(),
                TextButton(
                  onPressed: () => context.go('/employer/jobs/${job.id}/applicants'),
                  child: const Text('View Applicants'),
                ),
              ]),
            ]),
          );
        },
      ),
    );
  }
}

class _Job {
  final String id, title, city, salary, status;
  final int applicants;
  const _Job({required this.id, required this.title, required this.city, required this.salary, required this.applicants, required this.status});
}

final _jobs = [
  const _Job(id: '1', title: 'Senior Electrician', city: 'Mumbai', salary: '₹800/day', applicants: 12, status: 'Active'),
  const _Job(id: '2', title: 'AC Technician', city: 'Pune', salary: '₹700/day', applicants: 8, status: 'Active'),
  const _Job(id: '3', title: 'Carpenter', city: 'Delhi', salary: '₹650/day', applicants: 5, status: 'Closed'),
];
