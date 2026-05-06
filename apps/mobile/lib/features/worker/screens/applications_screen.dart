import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Applications tracker with status filter tabs
class ApplicationsScreen extends StatefulWidget {
  const ApplicationsScreen({super.key});

  @override
  State<ApplicationsScreen> createState() => _ApplicationsScreenState();
}

class _ApplicationsScreenState extends State<ApplicationsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() { _tabCtrl.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Applications'),
        bottom: TabBar(
          controller: _tabCtrl,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textTertiary,
          indicatorSize: TabBarIndicatorSize.label,
          tabs: const [
            Tab(text: 'All'),
            Tab(text: 'Applied'),
            Tab(text: 'Shortlisted'),
            Tab(text: 'Hired'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabCtrl,
        children: [
          _buildList(_mockApplications),
          _buildList(_mockApplications.where((a) => a.status == 'APPLIED').toList()),
          _buildList(_mockApplications.where((a) => a.status == 'SHORTLISTED').toList()),
          _buildList(_mockApplications.where((a) => a.status == 'HIRED').toList()),
        ],
      ),
    );
  }

  Widget _buildList(List<_Application> apps) {
    if (apps.isEmpty) {
      return Center(child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(LucideIcons.inbox, size: 56, color: AppColors.textTertiary.withValues(alpha: 0.4)),
          const SizedBox(height: 12),
          Text('No applications yet', style: Theme.of(context).textTheme.bodyMedium),
        ],
      ));
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: apps.length,
      itemBuilder: (_, i) => _ApplicationCard(app: apps[i]),
    );
  }
}

class _ApplicationCard extends StatelessWidget {
  final _Application app;
  const _ApplicationCard({required this.app});

  @override
  Widget build(BuildContext context) {
    final statusColor = _statusColor(app.status);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white, borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, 4))],
      ),
      child: Row(
        children: [
          Expanded(child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(app.job, style: Theme.of(context).textTheme.titleSmall),
              const SizedBox(height: 4),
              Text('${app.company} • ${app.date}', style: Theme.of(context).textTheme.bodySmall),
            ],
          )),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: statusColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(app.status, style: TextStyle(
              color: statusColor, fontSize: 11, fontWeight: FontWeight.w700,
            )),
          ),
        ],
      ),
    );
  }

  Color _statusColor(String status) {
    switch (status) {
      case 'APPLIED': return AppColors.info;
      case 'SHORTLISTED': return AppColors.warning;
      case 'HIRED': return AppColors.success;
      case 'REJECTED': return AppColors.error;
      default: return AppColors.textTertiary;
    }
  }
}

class _Application {
  final String job, company, status, date;
  const _Application({required this.job, required this.company, required this.status, required this.date});
}

final _mockApplications = [
  const _Application(job: 'Senior Electrician', company: 'Tata Projects', status: 'HIRED', date: 'Apr 15'),
  const _Application(job: 'AC Technician', company: 'Urban Company', status: 'SHORTLISTED', date: 'Apr 14'),
  const _Application(job: 'Maintenance Electrician', company: 'Infosys Campus', status: 'APPLIED', date: 'Apr 13'),
  const _Application(job: 'Plumber', company: 'L&T', status: 'REJECTED', date: 'Apr 10'),
  const _Application(job: 'Wireman', company: 'Reliance Jio', status: 'APPLIED', date: 'Apr 9'),
];
