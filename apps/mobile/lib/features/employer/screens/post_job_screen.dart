import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// Post a new job — multi-step form with AI salary prediction
class PostJobScreen extends StatefulWidget {
  const PostJobScreen({super.key});

  @override
  State<PostJobScreen> createState() => _PostJobScreenState();
}

class _PostJobScreenState extends State<PostJobScreen> {
  int _step = 0;
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  String _selectedCity = 'Mumbai';
  String _selectedType = 'FULL_TIME';
  final List<String> _selectedSkills = [];
  bool _showSalaryPrediction = false;

  final _allSkills = ['Wiring', 'Panel Board', 'MCB', 'Earthing', 'Pipe Fitting', 'Welding', 'Painting', 'Carpentry'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Post Job (${_step + 1}/3)'),
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () {
            if (_step > 0) {
              setState(() => _step--);
            } else {
              Navigator.pop(context);
            }
          },
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: [_buildStep1(), _buildStep2(), _buildStep3()][_step],
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: SafeArea(child: ElevatedButton(
          onPressed: () {
            if (_step < 2) {
              setState(() => _step++);
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('✅ Job posted successfully!')),
              );
              Navigator.pop(context);
            }
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.employerAccent,
            padding: const EdgeInsets.symmetric(vertical: 16),
          ),
          child: Text(_step < 2 ? 'Next' : 'Publish Job'),
        )),
      ),
    );
  }

  Widget _buildStep1() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text('Job Details', style: Theme.of(context).textTheme.headlineSmall),
    const SizedBox(height: 20),
    TextField(controller: _titleCtrl, decoration: const InputDecoration(labelText: 'Job Title', hintText: 'e.g. Senior Electrician')),
    const SizedBox(height: 16),
    TextField(controller: _descCtrl, maxLines: 4, decoration: const InputDecoration(labelText: 'Description', hintText: 'Describe the role...')),
    const SizedBox(height: 16),
    DropdownButtonFormField<String>(
      // ignore: deprecated_member_use
      initialValue: _selectedCity,
      decoration: const InputDecoration(labelText: 'City'),
      items: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai']
        .map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
      onChanged: (v) => setState(() => _selectedCity = v!),
    ),
  ]);

  Widget _buildStep2() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text('Skills & Type', style: Theme.of(context).textTheme.headlineSmall),
    const SizedBox(height: 20),
    Text('Required Skills', style: Theme.of(context).textTheme.titleSmall),
    const SizedBox(height: 8),
    Wrap(spacing: 8, runSpacing: 8, children: _allSkills.map((s) {
      final selected = _selectedSkills.contains(s);
      return GestureDetector(
        onTap: () => setState(() { selected ? _selectedSkills.remove(s) : _selectedSkills.add(s); }),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: selected ? AppColors.employerAccent.withValues(alpha: 0.1) : AppColors.surface2,
            borderRadius: BorderRadius.circular(8),
            border: selected ? Border.all(color: AppColors.employerAccent.withValues(alpha: 0.3)) : null,
          ),
          child: Text(s, style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600,
            color: selected ? AppColors.employerAccent : AppColors.textSecondary)),
        ),
      );
    }).toList()),
    const SizedBox(height: 20),
    Text('Job Type', style: Theme.of(context).textTheme.titleSmall),
    const SizedBox(height: 8),
    ...['FULL_TIME', 'CONTRACT', 'ONE_DAY'].map((t) => _JobTypeTile(
      title: t.replaceAll('_', ' '),
      selected: _selectedType == t,
      onTap: () => setState(() => _selectedType = t),
    )),
  ]);

  Widget _buildStep3() => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text('Salary & Preview', style: Theme.of(context).textTheme.headlineSmall),
    const SizedBox(height: 20),
    TextField(
      decoration: const InputDecoration(labelText: 'Daily Rate (₹)', hintText: '700', prefixText: '₹ '),
      keyboardType: TextInputType.number,
      onChanged: (_) => setState(() => _showSalaryPrediction = true),
    ),
    if (_showSalaryPrediction) ...[
      const SizedBox(height: 12),
      Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.employerAccent.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.employerAccent.withValues(alpha: 0.2)),
        ),
        child: Row(children: [
          Icon(LucideIcons.sparkles, size: 18, color: AppColors.employerAccent),
          const SizedBox(width: 10),
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            const Text('AI Salary Suggestion', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.employerAccent)),
            const SizedBox(height: 4),
            Text('₹600 – ₹800/day for this role in $_selectedCity', style: Theme.of(context).textTheme.bodySmall),
          ])),
        ]),
      ),
    ],
    const SizedBox(height: 24),
    Text('Preview', style: Theme.of(context).textTheme.titleSmall),
    const SizedBox(height: 8),
    Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12)]),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text(_titleCtrl.text.isEmpty ? 'Job Title' : _titleCtrl.text, style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 4),
        Text('$_selectedCity • $_selectedType', style: Theme.of(context).textTheme.bodySmall),
        const SizedBox(height: 8),
        Wrap(spacing: 6, children: _selectedSkills.map((s) => Chip(label: Text(s, style: const TextStyle(fontSize: 11)))).toList()),
      ]),
    ),
  ]);
}

class _JobTypeTile extends StatelessWidget {
  final String title;
  final bool selected;
  final VoidCallback onTap;
  const _JobTypeTile({required this.title, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: selected ? AppColors.employerAccent.withValues(alpha: 0.08) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: selected ? AppColors.employerAccent : Colors.transparent, width: 1.5),
        ),
        child: Row(children: [
          Icon(
            selected ? LucideIcons.circleCheck : LucideIcons.circle,
            size: 20,
            color: selected ? AppColors.employerAccent : AppColors.textTertiary,
          ),
          const SizedBox(width: 12),
          Text(title, style: TextStyle(
            fontSize: 14, fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
            color: selected ? AppColors.employerAccent : AppColors.textPrimary,
          )),
        ]),
      ),
    );
  }
}
