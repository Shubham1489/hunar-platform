import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Worker search/filter for customers
class WorkerSearchScreen extends StatelessWidget {
  const WorkerSearchScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Find Workers')),
      body: Column(children: [
        Padding(padding: const EdgeInsets.all(16), child: TextField(
          decoration: InputDecoration(hintText: 'Search by skill or name...', prefixIcon: const Icon(LucideIcons.search, size: 20)),
        )),
        SizedBox(height: 36, child: ListView(
          scrollDirection: Axis.horizontal, padding: const EdgeInsets.symmetric(horizontal: 16),
          children: ['Near Me', '4★+', '₹500-800', 'Verified'].map((f) => Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(label: Text(f), selected: f == 'Near Me', onSelected: (_) {}),
          )).toList(),
        )),
        const SizedBox(height: 8),
        Expanded(child: ListView.builder(
          padding: const EdgeInsets.all(16), itemCount: _workers.length,
          itemBuilder: (_, i) {
            final w = _workers[i];
            return GestureDetector(
              onTap: () => context.go('/customer/book/${w.id}'),
              child: Container(
                margin: const EdgeInsets.only(bottom: 12), padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
                  boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)]),
                child: Row(children: [
                  CircleAvatar(radius: 24, backgroundColor: AppColors.surface2,
                    child: Text(w.name[0], style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 18))),
                  const SizedBox(width: 14),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Row(children: [
                      Text(w.name, style: Theme.of(context).textTheme.titleSmall),
                      if (w.verified) ...[const SizedBox(width: 4), Icon(LucideIcons.shieldCheck, size: 14, color: AppColors.success)],
                    ]),
                    Text('${w.skill} • ${w.distance}', style: Theme.of(context).textTheme.bodySmall),
                    Row(children: [
                      Text('${w.rating}★', style: TextStyle(color: AppColors.warning, fontSize: 12, fontWeight: FontWeight.w600)),
                      const SizedBox(width: 8),
                      Text(w.rate, style: TextStyle(color: AppColors.success, fontWeight: FontWeight.w700, fontSize: 14)),
                    ]),
                  ])),
                  ElevatedButton(onPressed: () => context.go('/customer/book/${w.id}'),
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.customerAccent,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8)),
                    child: const Text('Book', style: TextStyle(fontSize: 12))),
                ]),
              ),
            );
          },
        )),
      ]),
    );
  }
}

class _Worker {
  final String id, name, skill, rate, distance;
  final double rating;
  final bool verified;
  const _Worker({required this.id, required this.name, required this.skill, required this.rating, required this.rate, required this.distance, required this.verified});
}

final _workers = [
  const _Worker(id: 'w1', name: 'Suresh K', skill: 'Electrician', rating: 4.9, rate: '₹500/hr', distance: '2.3 km', verified: true),
  const _Worker(id: 'w2', name: 'Amit P', skill: 'Plumber', rating: 4.7, rate: '₹450/hr', distance: '3.1 km', verified: true),
  const _Worker(id: 'w3', name: 'Ravi M', skill: 'Carpenter', rating: 4.5, rate: '₹600/hr', distance: '5.0 km', verified: false),
];
