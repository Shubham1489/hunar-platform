import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/auth/auth_provider.dart';

/// Customer Dashboard — services, active bookings, nearby workers
class CustomerDashboardScreen extends ConsumerWidget {
  const CustomerDashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final name = (auth.user?['name'] as String?) ?? 'Customer';

    return Scaffold(
      body: SafeArea(child: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            CircleAvatar(radius: 24, backgroundColor: AppColors.customerAccent.withValues(alpha: 0.1),
              child: Text(name[0].toUpperCase(), style: const TextStyle(
                fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.customerAccent))),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Hello! 👋', style: Theme.of(context).textTheme.bodySmall),
              Text(name, style: Theme.of(context).textTheme.headlineSmall),
            ])),
            IconButton(onPressed: () {}, icon: const Icon(LucideIcons.bell, size: 22)),
          ]),

          const SizedBox(height: 24),

          // Search
          GestureDetector(
            onTap: () => context.go('/customer/workers'),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
              child: Row(children: [
                Icon(LucideIcons.search, size: 20, color: AppColors.textTertiary),
                const SizedBox(width: 10),
                Text('Search electrician, plumber...', style: TextStyle(color: AppColors.textTertiary, fontSize: 14)),
              ]),
            ),
          ),

          const SizedBox(height: 24),

          // Service categories
          Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Text('Services', style: Theme.of(context).textTheme.titleLarge),
            TextButton(onPressed: () => context.go('/customer/services'), child: const Text('View All')),
          ]),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 4, shrinkWrap: true, physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12, crossAxisSpacing: 12,
            children: _services.map((svc) => GestureDetector(
              onTap: () => context.go('/customer/workers'),
              child: Container(
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
                child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Text(svc.emoji, style: const TextStyle(fontSize: 28)),
                  const SizedBox(height: 6),
                  Text(svc.name, textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600)),
                ]),
              ),
            )).toList(),
          ),

          const SizedBox(height: 24),

          // Active bookings
          Text('Active Bookings', style: Theme.of(context).textTheme.titleLarge),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)]),
            child: Row(children: [
              Container(width: 48, height: 48,
                decoration: BoxDecoration(color: AppColors.customerAccent.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                child: const Center(child: Text('⚡', style: TextStyle(fontSize: 24)))),
              const SizedBox(width: 14),
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Electrical Repair', style: Theme.of(context).textTheme.titleSmall),
                Text('Suresh Kumar • Tomorrow 10 AM', style: Theme.of(context).textTheme.bodySmall),
              ])),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: AppColors.warning.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                child: const Text('CONFIRMED', style: TextStyle(color: AppColors.warning, fontSize: 10, fontWeight: FontWeight.w700)),
              ),
            ]),
          ),
        ]),
      )),
    );
  }
}

class _ServiceItem {
  final String emoji;
  final String name;
  const _ServiceItem(this.emoji, this.name);
}

final _services = [
  const _ServiceItem('⚡', 'Electrician'),
  const _ServiceItem('🔧', 'Plumber'),
  const _ServiceItem('🪚', 'Carpenter'),
  const _ServiceItem('🎨', 'Painter'),
  const _ServiceItem('❄️', 'AC Repair'),
  const _ServiceItem('🧹', 'Cleaning'),
  const _ServiceItem('🔨', 'Handyman'),
  const _ServiceItem('🍳', 'Cook'),
];
