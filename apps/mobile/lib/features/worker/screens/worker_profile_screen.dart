import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../../../core/theme/app_colors.dart';

/// Worker profile with voice-to-skill input
class WorkerProfileScreen extends ConsumerStatefulWidget {
  const WorkerProfileScreen({super.key});

  @override
  ConsumerState<WorkerProfileScreen> createState() => _WorkerProfileScreenState();
}

class _WorkerProfileScreenState extends ConsumerState<WorkerProfileScreen> {
  final _stt = stt.SpeechToText();
  bool _isListening = false;
  String _voiceText = '';
  final List<String> _skills = ['Electrician', 'Wiring', 'Panel Board', 'MCB Installation'];
  bool _isEditing = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
        actions: [
          TextButton(
            onPressed: () => setState(() => _isEditing = !_isEditing),
            child: Text(_isEditing ? 'Save' : 'Edit'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ─── Avatar & Name ───────────────
            Center(child: Column(children: [
              Stack(
                children: [
                  CircleAvatar(
                    radius: 48,
                    backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                    child: const Text('RS', style: TextStyle(
                      fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.primary,
                    )),
                  ),
                  if (_isEditing)
                    Positioned(
                      bottom: 0, right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(6),
                        decoration: const BoxDecoration(
                          color: AppColors.primary, shape: BoxShape.circle,
                        ),
                        child: const Icon(LucideIcons.camera, size: 16, color: Colors.white),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 12),
              Text('Rajesh Sharma', style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 4),
              Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                const Icon(LucideIcons.shieldCheck, size: 14, color: AppColors.success),
                const SizedBox(width: 4),
                Text('Verified • 4.8★ • 3 yrs exp', style: Theme.of(context).textTheme.bodySmall),
              ]),
            ])),

            const SizedBox(height: 28),

            // ─── Stats Row ───────────────────
            Row(
              children: [
                _StatCard(label: 'Jobs Done', value: '47'),
                const SizedBox(width: 12),
                _StatCard(label: 'Rating', value: '4.8'),
                const SizedBox(width: 12),
                _StatCard(label: 'Earned', value: '₹2.1L'),
              ],
            ),

            const SizedBox(height: 28),

            // ─── Skills Section ──────────────
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Skills', style: Theme.of(context).textTheme.titleLarge),
                if (_isEditing) Row(children: [
                  // Voice input button
                  GestureDetector(
                    onTap: _startVoiceInput,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: _isListening
                            ? AppColors.error.withValues(alpha: 0.1)
                            : AppColors.employerAccent.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(children: [
                        Icon(
                          _isListening ? LucideIcons.micOff : LucideIcons.mic,
                          size: 16,
                          color: _isListening ? AppColors.error : AppColors.employerAccent,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _isListening ? 'Stop' : 'Voice Input',
                          style: TextStyle(
                            fontSize: 12, fontWeight: FontWeight.w600,
                            color: _isListening ? AppColors.error : AppColors.employerAccent,
                          ),
                        ),
                      ]),
                    ),
                  ),
                ]),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Tap mic to add skills in Hindi or English',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 12),

            // Voice transcript
            if (_voiceText.isNotEmpty) Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: AppColors.employerAccent.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.employerAccent.withValues(alpha: 0.2)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Heard:', style: TextStyle(fontSize: 11, color: AppColors.textTertiary)),
                  const SizedBox(height: 4),
                  Text(_voiceText, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                ],
              ),
            ),

            // Skill chips
            Wrap(
              spacing: 8, runSpacing: 8,
              children: _skills.map((s) => Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(s, style: const TextStyle(
                      fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primary,
                    )),
                    if (_isEditing) ...[
                      const SizedBox(width: 6),
                      GestureDetector(
                        onTap: () => setState(() => _skills.remove(s)),
                        child: Icon(LucideIcons.x, size: 14, color: AppColors.primary.withValues(alpha: 0.5)),
                      ),
                    ],
                  ],
                ),
              )).toList(),
            ),

            const SizedBox(height: 28),

            // ─── Contact Info ────────────────
            Text('Contact', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 12),
            _InfoRow(icon: LucideIcons.phone, label: '+91 98765 43210'),
            _InfoRow(icon: LucideIcons.mapPin, label: 'Mumbai, Maharashtra'),
            _InfoRow(icon: LucideIcons.briefcase, label: '3 years experience'),
          ],
        ),
      ),
    );
  }

  Future<void> _startVoiceInput() async {
    if (_isListening) {
      await _stt.stop();
      setState(() => _isListening = false);
      // In production, send _voiceText to /ai/extract-skills
      if (_voiceText.isNotEmpty) {
        // Simulate AI skill extraction
        await Future.delayed(const Duration(milliseconds: 500));
        setState(() {
          _skills.add('HVAC'); // Simulated AI extraction
          _voiceText = '';
        });
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('✅ Skill "HVAC" extracted from voice!')),
          );
        }
      }
      return;
    }

    final available = await _stt.initialize();
    if (!available) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Microphone not available')),
        );
      }
      return;
    }

    setState(() => _isListening = true);
    await _stt.listen(
      onResult: (result) {
        setState(() => _voiceText = result.recognizedWords);
      },
      localeId: 'hi_IN', // Hindi first
      listenFor: const Duration(seconds: 10),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  const _StatCard({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(child: Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white, borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)],
      ),
      child: Column(
        children: [
          Text(value, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 4),
          Text(label, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    ));
  }
}

class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  const _InfoRow({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(children: [
        Icon(icon, size: 18, color: AppColors.textTertiary),
        const SizedBox(width: 12),
        Text(label, style: Theme.of(context).textTheme.bodyMedium),
      ]),
    );
  }
}
