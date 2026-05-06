import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

class _JobItem {
  final String id, title, company, city, salary;
  final int match;
  final bool urgent;
  const _JobItem({required this.id, required this.title, required this.company, required this.city, required this.salary, required this.match, this.urgent = false});
}

/// Job search screen with filters and AI match scores
class JobSearchScreen extends ConsumerStatefulWidget {
  const JobSearchScreen({super.key});

  @override
  ConsumerState<JobSearchScreen> createState() => _JobSearchScreenState();
}

class _JobSearchScreenState extends ConsumerState<JobSearchScreen> {
  String _query = '';
  String _selectedCity = 'All';

  final _cities = ['All', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Find Jobs')),
      body: Column(children: [
        Padding(padding: const EdgeInsets.all(16), child: TextField(
          onChanged: (v) => setState(() => _query = v),
          decoration: InputDecoration(
            hintText: 'Search electrician, plumber, carpenter...',
            prefixIcon: const Icon(LucideIcons.search, size: 20),
            suffixIcon: _query.isNotEmpty ? IconButton(onPressed: () => setState(() => _query = ''), icon: const Icon(LucideIcons.x, size: 18)) : null,
          ),
        )),
        SizedBox(height: 36, child: ListView.separated(
          scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: _cities.length, separatorBuilder: (_, s2) => const SizedBox(width: 8),
          itemBuilder: (_, i) {
            final isActive = _cities[i] == _selectedCity;
            return GestureDetector(
              onTap: () => setState(() => _selectedCity = _cities[i]),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(color: isActive ? AppColors.primary : AppColors.surface2, borderRadius: BorderRadius.circular(20)),
                alignment: Alignment.center,
                child: Text(_cities[i], style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: isActive ? Colors.white : AppColors.textSecondary)),
              ),
            );
          },
        )),
        const SizedBox(height: 16),
        Expanded(child: ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16), itemCount: _allJobs.length,
          itemBuilder: (_, i) => _JobListItem(job: _allJobs[i], onTap: () => context.go('/worker/jobs/${_allJobs[i].id}')),
        )),
      ]),
    );
  }
}

class _JobListItem extends StatelessWidget {
  final _JobItem job;
  final VoidCallback onTap;
  const _JobListItem({required this.job, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4))]),
        child: Row(children: [
          Container(width: 48, height: 48,
            decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(12)),
            child: Center(child: Text(job.company[0], style: const TextStyle(fontWeight: FontWeight.w800, color: AppColors.primary, fontSize: 18)))),
          const SizedBox(width: 14),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(job.title, style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 4),
            Row(children: [
              Icon(LucideIcons.building2, size: 13, color: AppColors.textTertiary), const SizedBox(width: 4),
              Text(job.company, style: Theme.of(context).textTheme.bodySmall),
              const SizedBox(width: 12),
              Icon(LucideIcons.mapPin, size: 13, color: AppColors.textTertiary), const SizedBox(width: 4),
              Text(job.city, style: Theme.of(context).textTheme.bodySmall),
            ]),
            const SizedBox(height: 6),
            Row(children: [
              Text(job.salary, style: TextStyle(color: AppColors.success, fontWeight: FontWeight.w700, fontSize: 14)),
              const Spacer(),
              if (job.urgent) Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(color: AppColors.error.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
                child: const Text('URGENT', style: TextStyle(color: AppColors.error, fontSize: 10, fontWeight: FontWeight.w700)),
              ),
            ]),
          ])),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            decoration: BoxDecoration(color: _matchColor(job.match).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
            child: Column(children: [
              Icon(LucideIcons.sparkles, size: 14, color: _matchColor(job.match)),
              const SizedBox(height: 2),
              Text('${job.match}%', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: _matchColor(job.match))),
            ]),
          ),
        ]),
      ),
    );
  }

  Color _matchColor(int match) {
    if (match >= 80) return AppColors.success;
    if (match >= 50) return AppColors.warning;
    return AppColors.textTertiary;
  }
}

final _allJobs = [
  const _JobItem(id: '1', title: 'Senior Electrician', company: 'Tata Projects', city: 'Mumbai', salary: '₹800/day', match: 95, urgent: true),
  const _JobItem(id: '2', title: 'AC Technician', company: 'Urban Company', city: 'Pune', salary: '₹700/day', match: 88),
  const _JobItem(id: '3', title: 'Plumber — Commercial', company: 'L&T Construction', city: 'Delhi', salary: '₹650/day', match: 82),
  const _JobItem(id: '4', title: 'Carpenter', company: 'Godrej Properties', city: 'Bangalore', salary: '₹750/day', match: 76, urgent: true),
  const _JobItem(id: '5', title: 'Painter — Interior', company: 'Asian Paints', city: 'Mumbai', salary: '₹600/day', match: 71),
  const _JobItem(id: '6', title: 'Welder — MIG', company: 'Jindal Steel', city: 'Chennai', salary: '₹900/day', match: 64),
];
