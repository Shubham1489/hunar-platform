import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';

/// UrbanClap-style service category grid
class ServicesScreen extends StatelessWidget {
  const ServicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('All Services')),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3, mainAxisSpacing: 12, crossAxisSpacing: 12, childAspectRatio: 0.9),
        itemCount: _allServices.length,
        itemBuilder: (_, i) {
          final svc = _allServices[i];
          return GestureDetector(
            onTap: () => context.go('/customer/workers'),
            child: Container(
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
                boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)]),
              child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                Text(svc.emoji, style: const TextStyle(fontSize: 36)),
                const SizedBox(height: 8),
                Text(svc.name, textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                if (svc.popular) ...[
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: AppColors.secondary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(4)),
                    child: const Text('Popular', style: TextStyle(color: AppColors.secondary, fontSize: 9, fontWeight: FontWeight.w700)),
                  ),
                ],
              ]),
            ),
          );
        },
      ),
    );
  }
}

class _ServiceItem {
  final String emoji;
  final String name;
  final bool popular;
  const _ServiceItem(this.emoji, this.name, {this.popular = false});
}

final _allServices = [
  const _ServiceItem('⚡', 'Electrician', popular: true),
  const _ServiceItem('🔧', 'Plumber', popular: true),
  const _ServiceItem('🪚', 'Carpenter'),
  const _ServiceItem('🎨', 'Painter', popular: true),
  const _ServiceItem('❄️', 'AC Repair', popular: true),
  const _ServiceItem('🧹', 'Cleaning'),
  const _ServiceItem('🔨', 'Handyman'),
  const _ServiceItem('🍳', 'Cook'),
  const _ServiceItem('🚗', 'Driver'),
  const _ServiceItem('🛡️', 'Security'),
  const _ServiceItem('🌿', 'Gardener'),
  const _ServiceItem('📦', 'Packing'),
];
