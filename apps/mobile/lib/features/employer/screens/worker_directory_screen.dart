import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Worker directory — browse and send offers
class WorkerDirectoryScreen extends StatelessWidget {
  const WorkerDirectoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Workers')),
      body: Column(children: [
        Padding(padding: const EdgeInsets.all(16), child: TextField(
          decoration: InputDecoration(hintText: 'Search workers...', prefixIcon: const Icon(LucideIcons.search, size: 20)),
        )),
        Expanded(child: ListView.builder(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: _workers.length,
          itemBuilder: (_, i) {
            final w = _workers[i];
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(14)),
              child: Row(children: [
                CircleAvatar(radius: 22, backgroundColor: AppColors.surface2,
                  child: Text(w.name[0], style: const TextStyle(fontWeight: FontWeight.w700))),
                const SizedBox(width: 12),
                Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Row(children: [
                    Text(w.name, style: Theme.of(context).textTheme.titleSmall),
                    if (w.verified) ...[const SizedBox(width: 4), Icon(LucideIcons.shieldCheck, size: 14, color: AppColors.success)],
                  ]),
                  Text('${w.skill} • ${w.rating}★ • ${w.city}', style: Theme.of(context).textTheme.bodySmall),
                ])),
                ElevatedButton(onPressed: () {}, style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.employerAccent, padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8)),
                  child: const Text('Offer', style: TextStyle(fontSize: 12)),
                ),
              ]),
            );
          },
        )),
      ]),
    );
  }
}

class _DirectoryWorker {
  final String name, skill, city;
  final double rating;
  final bool verified;
  const _DirectoryWorker({required this.name, required this.skill, required this.rating, required this.city, required this.verified});
}

final _workers = [
  const _DirectoryWorker(name: 'Suresh K', skill: 'Electrician', rating: 4.9, city: 'Mumbai', verified: true),
  const _DirectoryWorker(name: 'Amit P', skill: 'Plumber', rating: 4.7, city: 'Delhi', verified: true),
  const _DirectoryWorker(name: 'Ravi M', skill: 'Carpenter', rating: 4.5, city: 'Pune', verified: false),
  const _DirectoryWorker(name: 'Deepak S', skill: 'Painter', rating: 4.3, city: 'Mumbai', verified: true),
];
