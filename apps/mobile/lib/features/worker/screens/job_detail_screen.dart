import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Job detail screen — full job info with apply action
class JobDetailScreen extends StatelessWidget {
  final String jobId;
  const JobDetailScreen({super.key, required this.jobId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // ─── Header ────────────────────────
          SliverAppBar(
            expandedHeight: 180,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(gradient: AppColors.workerGradient),
                padding: const EdgeInsets.fromLTRB(20, 80, 20, 20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.success.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(LucideIcons.sparkles, size: 14, color: Colors.white),
                          SizedBox(width: 4),
                          Text('95% Match', style: TextStyle(
                            color: Colors.white, fontSize: 13, fontWeight: FontWeight.w700,
                          )),
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text('Senior Electrician', style: TextStyle(
                      color: Colors.white, fontSize: 24, fontWeight: FontWeight.w800,
                    )),
                    const SizedBox(height: 4),
                    Text('Tata Projects • Mumbai', style: TextStyle(
                      color: Colors.white.withValues(alpha: 0.7), fontSize: 14,
                    )),
                  ],
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ─── Key Info ──────────────────
                Row(
                  children: [
                    _InfoPill(icon: LucideIcons.indianRupee, label: '₹800/day', color: AppColors.success),
                    const SizedBox(width: 10),
                    _InfoPill(icon: LucideIcons.clock, label: 'Full Time', color: AppColors.primary),
                    const SizedBox(width: 10),
                    _InfoPill(icon: LucideIcons.users, label: '12 Applied', color: AppColors.secondary),
                  ],
                ),

                const SizedBox(height: 24),

                // ─── Description ───────────────
                Text('Description', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 8),
                Text(
                  'We are looking for an experienced electrician to handle large-scale commercial wiring projects. '
                  'The role involves installing electrical systems, troubleshooting faults, and ensuring compliance '
                  'with safety standards. Minimum 3 years of experience required.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(height: 1.6),
                ),

                const SizedBox(height: 24),

                // ─── Required Skills ───────────
                Text('Required Skills', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8, runSpacing: 8,
                  children: ['Wiring', 'Panel Board', 'MCB Installation', 'Earthing', 'Cable Tray']
                    .map((s) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(s, style: const TextStyle(
                        fontSize: 13, fontWeight: FontWeight.w600,
                        color: AppColors.primary,
                      )),
                    )).toList(),
                ),

                const SizedBox(height: 24),

                // ─── Benefits ──────────────────
                Text('Benefits', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 12),
                ...[
                  '🏠 Accommodation provided',
                  '🍱 Daily meals included',
                  '🚌 Transport from pickup point',
                  '🩺 Health insurance coverage',
                ].map((b) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Text(b, style: Theme.of(context).textTheme.bodyMedium),
                )),

                const SizedBox(height: 24),

                // ─── Company Info ──────────────
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surface2,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 48, height: 48,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Center(child: Text('T', style: TextStyle(
                          fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.primary,
                        ))),
                      ),
                      const SizedBox(width: 14),
                      Expanded(child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Tata Projects', style: Theme.of(context).textTheme.titleSmall),
                          const SizedBox(height: 2),
                          Text('4.6★ • 500+ hires', style: Theme.of(context).textTheme.bodySmall),
                        ],
                      )),
                      const Icon(LucideIcons.externalLink, size: 18, color: AppColors.textTertiary),
                    ],
                  ),
                ),

                const SizedBox(height: 100), // Space for bottom bar
              ],
            ),
          )),
        ],
      ),

      // ─── Bottom Action Bar ─────────────────
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 20,
              offset: const Offset(0, -4),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              IconButton(
                onPressed: () {},
                icon: const Icon(LucideIcons.bookmark, size: 22),
                style: IconButton.styleFrom(
                  backgroundColor: AppColors.surface2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.all(14),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('✅ Application submitted!'),
                        backgroundColor: AppColors.success,
                      ),
                    );
                  },
                  icon: const Icon(LucideIcons.send, size: 18),
                  label: const Text('Apply Now'),
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InfoPill extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  const _InfoPill({required this.icon, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 6),
          Text(label, style: TextStyle(
            fontSize: 13, fontWeight: FontWeight.w600, color: color,
          )),
        ],
      ),
    );
  }
}
