import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

class _Transaction {
  final String title, date, amount, type;
  const _Transaction({required this.title, required this.date, required this.amount, required this.type});
}

/// Worker earnings screen with chart and transaction history
class EarningsScreen extends StatelessWidget {
  const EarningsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Earnings')),
      body: SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(
        crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: const [
            _StatCard(label: 'Total', value: '₹45,200', color: AppColors.primary),
            SizedBox(width: 12),
            _StatCard(label: 'Pending', value: '₹8,500', color: AppColors.warning),
            SizedBox(width: 12),
            _StatCard(label: 'This Week', value: '₹12,000', color: AppColors.success),
          ]),
          const SizedBox(height: 24),
          Container(
            height: 200, width: double.infinity, padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)]),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Monthly Trend', style: Theme.of(context).textTheme.titleSmall),
              const SizedBox(height: 16),
              Expanded(child: Row(crossAxisAlignment: CrossAxisAlignment.end, mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: const [
                _Bar(label: 'Jan', height: 0.4), _Bar(label: 'Feb', height: 0.55),
                _Bar(label: 'Mar', height: 0.7), _Bar(label: 'Apr', height: 0.85),
                _Bar(label: 'May', height: 0.6), _Bar(label: 'Jun', height: 1.0),
              ])),
            ]),
          ),
          const SizedBox(height: 24),
          Text('Recent Transactions', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          ..._transactions.map((t) => Container(
            margin: const EdgeInsets.only(bottom: 10), padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
            child: Row(children: [
              Container(width: 40, height: 40,
                decoration: BoxDecoration(
                  color: (t.type == 'credit' ? AppColors.success : AppColors.error).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10)),
                child: Icon(t.type == 'credit' ? LucideIcons.arrowDownLeft : LucideIcons.arrowUpRight,
                  size: 18, color: t.type == 'credit' ? AppColors.success : AppColors.error)),
              const SizedBox(width: 12),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(t.title, style: Theme.of(context).textTheme.titleSmall),
                Text(t.date, style: Theme.of(context).textTheme.bodySmall),
              ])),
              Text('${t.type == 'credit' ? '+' : '-'}${t.amount}',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 15,
                  color: t.type == 'credit' ? AppColors.success : AppColors.error)),
            ]),
          )),
        ],
      )),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label, value; final Color color;
  const _StatCard({required this.label, required this.value, required this.color});
  @override
  Widget build(BuildContext context) {
    return Expanded(child: Container(padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(14)),
      child: Column(children: [
        Text(value, style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: color)),
        const SizedBox(height: 4),
        Text(label, style: TextStyle(fontSize: 11, color: color.withValues(alpha: 0.7))),
      ]),
    ));
  }
}

class _Bar extends StatelessWidget {
  final String label; final double height;
  const _Bar({required this.label, required this.height});
  @override
  Widget build(BuildContext context) {
    return Column(mainAxisAlignment: MainAxisAlignment.end, children: [
      Container(width: 28, height: 100 * height,
        decoration: BoxDecoration(gradient: AppColors.workerGradient, borderRadius: BorderRadius.circular(6))),
      const SizedBox(height: 6),
      Text(label, style: const TextStyle(fontSize: 10, color: AppColors.textTertiary)),
    ]);
  }
}

final _transactions = [
  const _Transaction(title: 'Tata Projects — Wiring', date: 'Apr 15', amount: '₹4,800', type: 'credit'),
  const _Transaction(title: 'Platform Fee', date: 'Apr 15', amount: '₹480', type: 'debit'),
  const _Transaction(title: 'Urban Company — AC', date: 'Apr 12', amount: '₹3,500', type: 'credit'),
  const _Transaction(title: 'L&T — Plumbing', date: 'Apr 10', amount: '₹2,600', type: 'credit'),
];
