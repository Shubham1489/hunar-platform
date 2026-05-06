import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';

/// 3-step booking flow: Details → Schedule → Payment
class BookingScreen extends StatefulWidget {
  final String workerId;
  const BookingScreen({super.key, required this.workerId});

  @override
  State<BookingScreen> createState() => _BookingScreenState();
}

class _BookingScreenState extends State<BookingScreen> {
  int _step = 0;
  String _selectedService = '';
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 1));
  String _selectedTime = '10:00 AM';
  String _paymentMethod = 'UPI';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Book Worker (${_step + 1}/3)')),
      body: [_step1(), _step2(), _step3()][_step],
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.all(16),
        child: SafeArea(child: Row(children: [
          if (_step > 0) Expanded(child: OutlinedButton(
            onPressed: () => setState(() => _step--), child: const Text('Back'))),
          if (_step > 0) const SizedBox(width: 12),
          Expanded(child: ElevatedButton(
            onPressed: () {
              if (_step < 2) {
                setState(() => _step++);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('✅ Booking confirmed! Worker will be notified.')));
                Navigator.pop(context);
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.customerAccent,
              padding: const EdgeInsets.symmetric(vertical: 16)),
            child: Text(_step < 2 ? 'Next' : 'Confirm & Pay ₹1,500'),
          )),
        ])),
      ),
    );
  }

  Widget _step1() => SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(
    crossAxisAlignment: CrossAxisAlignment.start, children: [
      // Worker profile card
      Container(padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: Row(children: [
          CircleAvatar(radius: 28, backgroundColor: AppColors.surface2,
            child: const Text('S', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 22))),
          const SizedBox(width: 14),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('Suresh Kumar', style: Theme.of(context).textTheme.titleSmall),
            Row(children: [
              const Icon(LucideIcons.shieldCheck, size: 14, color: AppColors.success),
              const SizedBox(width: 4),
              Text('Verified • 4.9★ • 5 yrs exp', style: Theme.of(context).textTheme.bodySmall),
            ]),
          ]),
        ]),
      ),
      const SizedBox(height: 24),
      Text('Select Service', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: 12),
      ...['Electrical Repair', 'New Wiring', 'Panel Installation', 'Maintenance'].map((s) =>
        _ServiceTile(
          title: s,
          selected: _selectedService == s,
          onTap: () => setState(() => _selectedService = s),
        ),
      ),
      const SizedBox(height: 16),
      TextField(maxLines: 3, decoration: const InputDecoration(labelText: 'Description', hintText: 'Describe the issue...')),
    ],
  ));

  Widget _step2() => SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(
    crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Schedule', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: 16),
      CalendarDatePicker(
        initialDate: _selectedDate,
        firstDate: DateTime.now(),
        lastDate: DateTime.now().add(const Duration(days: 30)),
        onDateChanged: (date) => setState(() => _selectedDate = date),
      ),
      const SizedBox(height: 16),
      Text('Time Slot', style: Theme.of(context).textTheme.titleSmall),
      const SizedBox(height: 8),
      Wrap(spacing: 8, children: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'].map((t) {
        final isSelected = _selectedTime == t;
        return GestureDetector(
          onTap: () => setState(() => _selectedTime = t),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: isSelected ? AppColors.customerAccent : AppColors.surface2,
              borderRadius: BorderRadius.circular(10)),
            child: Text(t, style: TextStyle(
              fontWeight: FontWeight.w600, fontSize: 13,
              color: isSelected ? Colors.white : AppColors.textSecondary)),
          ),
        );
      }).toList()),
    ],
  ));

  Widget _step3() => SingleChildScrollView(padding: const EdgeInsets.all(20), child: Column(
    crossAxisAlignment: CrossAxisAlignment.start, children: [
      Text('Payment', style: Theme.of(context).textTheme.titleLarge),
      const SizedBox(height: 16),
      Container(padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
        child: const Column(children: [
          _PriceRow(label: 'Service Charge', value: '₹1,350'),
          _PriceRow(label: 'Platform Fee', value: '₹150'),
          Divider(height: 20),
          _PriceRow(label: 'Total', value: '₹1,500', bold: true),
        ]),
      ),
      const SizedBox(height: 20),
      Text('Payment Method', style: Theme.of(context).textTheme.titleSmall),
      const SizedBox(height: 8),
      ...['UPI', 'Card', 'Net Banking', 'Cash'].map((m) => _PaymentTile(
        title: m,
        selected: _paymentMethod == m,
        onTap: () => setState(() => _paymentMethod = m),
      )),
      const SizedBox(height: 12),
      Container(padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.info.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(12)),
        child: Row(children: [
          Icon(LucideIcons.shieldCheck, size: 16, color: AppColors.info),
          const SizedBox(width: 8),
          Expanded(child: Text('Payment held in escrow until job completion OTP is verified',
            style: TextStyle(fontSize: 12, color: AppColors.info))),
        ]),
      ),
    ],
  ));
}

class _ServiceTile extends StatelessWidget {
  final String title;
  final bool selected;
  final VoidCallback onTap;
  const _ServiceTile({required this.title, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: selected ? AppColors.customerAccent.withValues(alpha: 0.08) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: selected ? AppColors.customerAccent : Colors.transparent, width: 1.5),
        ),
        child: Row(children: [
          Icon(
            selected ? LucideIcons.circleCheck : LucideIcons.circle,
            size: 20,
            color: selected ? AppColors.customerAccent : AppColors.textTertiary,
          ),
          const SizedBox(width: 12),
          Text(title, style: TextStyle(
            fontSize: 14, fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
            color: selected ? AppColors.customerAccent : AppColors.textPrimary,
          )),
        ]),
      ),
    );
  }
}

class _PaymentTile extends StatelessWidget {
  final String title;
  final bool selected;
  final VoidCallback onTap;
  const _PaymentTile({required this.title, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary.withValues(alpha: 0.06) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: selected ? AppColors.primary : Colors.transparent, width: 1.5),
        ),
        child: Row(children: [
          Icon(
            selected ? LucideIcons.circleCheck : LucideIcons.circle,
            size: 20,
            color: selected ? AppColors.primary : AppColors.textTertiary,
          ),
          const SizedBox(width: 12),
          Text(title, style: TextStyle(
            fontSize: 14, fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
          )),
        ]),
      ),
    );
  }
}

class _PriceRow extends StatelessWidget {
  final String label, value;
  final bool bold;
  const _PriceRow({required this.label, required this.value, this.bold = false});
  @override
  Widget build(BuildContext context) {
    return Padding(padding: const EdgeInsets.symmetric(vertical: 4), child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
        Text(label, style: TextStyle(fontSize: 14, fontWeight: bold ? FontWeight.w700 : FontWeight.w400)),
        Text(value, style: TextStyle(fontSize: 14, fontWeight: bold ? FontWeight.w800 : FontWeight.w600,
          color: bold ? AppColors.textPrimary : AppColors.textSecondary)),
      ],
    ));
  }
}
