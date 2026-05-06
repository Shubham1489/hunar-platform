import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Customer profile screen
class CustomerProfileScreen extends StatelessWidget {
  const CustomerProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Profile'), actions: [
        TextButton(onPressed: () {}, child: const Text('Edit')),
      ]),
      body: SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(children: [
        CircleAvatar(radius: 48, backgroundColor: AppColors.customerAccent.withValues(alpha: 0.1),
          child: const Text('PK', style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.customerAccent))),
        const SizedBox(height: 12),
        Text('Priya Kapoor', style: Theme.of(context).textTheme.headlineSmall),
        Text('+91 99887 76655', style: Theme.of(context).textTheme.bodySmall),
        const SizedBox(height: 24),

        // Stats
        Row(children: [
          _Stat(label: 'Bookings', value: '12'),
          const SizedBox(width: 12),
          _Stat(label: 'Reviews', value: '8'),
          const SizedBox(width: 12),
          _Stat(label: 'Saved', value: '5'),
        ]),

        const SizedBox(height: 24),

        // Saved Addresses
        Align(alignment: Alignment.centerLeft, child: Text('Saved Addresses', style: Theme.of(context).textTheme.titleLarge)),
        const SizedBox(height: 12),
        ...['🏠 Home — 42, Andheri West, Mumbai', '🏢 Office — BKC Tower, Bandra'].map((a) => Container(
          margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
          child: Row(children: [
            Expanded(child: Text(a, style: Theme.of(context).textTheme.bodyMedium)),
            Icon(LucideIcons.chevronRight, size: 18, color: AppColors.textTertiary),
          ]),
        )),
      ])),
    );
  }
}

class _Stat extends StatelessWidget {
  final String label, value;
  const _Stat({required this.label, required this.value});
  @override
  Widget build(BuildContext context) {
    return Expanded(child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
      child: Column(children: [
        Text(value, style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 4),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ]),
    ));
  }
}
