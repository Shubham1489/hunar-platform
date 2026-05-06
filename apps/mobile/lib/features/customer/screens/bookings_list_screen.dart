import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Bookings list with OTP completion and rating
class BookingsListScreen extends StatelessWidget {
  const BookingsListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Bookings')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16), itemCount: _bookings.length,
        itemBuilder: (_, i) {
          final b = _bookings[i];
          final statusColor = _statusColor(b.status);
          return Container(
            margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)]),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Container(width: 44, height: 44,
                  decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                  child: Center(child: Text(b.emoji, style: const TextStyle(fontSize: 22)))),
                const SizedBox(width: 14),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(b.service, style: Theme.of(context).textTheme.titleSmall),
                  Text('${b.worker} • ${b.date}', style: Theme.of(context).textTheme.bodySmall),
                ])),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                  child: Text(b.status, style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.w700)),
                ),
              ]),
              const SizedBox(height: 12),
              Row(children: [
                Text(b.amount, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                const Spacer(),
                if (b.status == 'COMPLETED') OutlinedButton.icon(
                  onPressed: () => _showRatingDialog(context),
                  icon: const Icon(LucideIcons.star, size: 16),
                  label: const Text('Rate'),
                  style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6)),
                ),
                if (b.status == 'IN_PROGRESS') ElevatedButton.icon(
                  onPressed: () => _showOtpDialog(context),
                  icon: const Icon(LucideIcons.keyRound, size: 16),
                  label: const Text('Share OTP'),
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.customerAccent,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6)),
                ),
              ]),
            ]),
          );
        },
      ),
    );
  }

  void _showOtpDialog(BuildContext context) {
    showDialog(context: context, builder: (_) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: const Text('Completion OTP'),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        const Text('Share this OTP with the worker to confirm job completion:'),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          decoration: BoxDecoration(color: AppColors.surface2, borderRadius: BorderRadius.circular(12)),
          child: const Text('8 4 7 2 9 1', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, letterSpacing: 6)),
        ),
      ]),
      actions: [TextButton(onPressed: () => Navigator.pop(context), child: const Text('Done'))],
    ));
  }

  void _showRatingDialog(BuildContext context) {
    showDialog(context: context, builder: (_) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      title: const Text('Rate Worker'),
      content: Column(mainAxisSize: MainAxisSize.min, children: [
        Row(mainAxisAlignment: MainAxisAlignment.center, children: List.generate(5, (i) =>
          Icon(LucideIcons.star, size: 32, color: i < 4 ? AppColors.warning : AppColors.surface3))),
        const SizedBox(height: 16),
        const TextField(maxLines: 2, decoration: InputDecoration(hintText: 'Write a review...')),
      ]),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        ElevatedButton(onPressed: () {
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('⭐ Rating submitted!')));
        }, child: const Text('Submit')),
      ],
    ));
  }

  Color _statusColor(String s) {
    switch (s) {
      case 'CONFIRMED': return AppColors.info;
      case 'IN_PROGRESS': return AppColors.warning;
      case 'COMPLETED': return AppColors.success;
      case 'CANCELLED': return AppColors.error;
      default: return AppColors.textTertiary;
    }
  }
}

class _Booking {
  final String service, worker, date, amount, status, emoji;
  const _Booking({required this.service, required this.worker, required this.date, required this.amount, required this.status, required this.emoji});
}

final _bookings = [
  const _Booking(service: 'Electrical Repair', worker: 'Suresh K', date: 'Apr 20', amount: '₹1,500', status: 'CONFIRMED', emoji: '⚡'),
  const _Booking(service: 'AC Service', worker: 'Amit P', date: 'Apr 18', amount: '₹2,000', status: 'IN_PROGRESS', emoji: '❄️'),
  const _Booking(service: 'Plumbing Fix', worker: 'Ravi M', date: 'Apr 15', amount: '₹800', status: 'COMPLETED', emoji: '🔧'),
];
