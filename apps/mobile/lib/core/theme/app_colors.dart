import 'package:flutter/material.dart';

/// Hunar Color System — Matching web Stitch design tokens
class AppColors {
  AppColors._();

  // ─── Primary (Indigo) ─────────────────────
  static const primary = Color(0xFF1E3A8A);
  static const primaryLight = Color(0xFF3B82F6);
  static const primaryLighter = Color(0xFF60A5FA);

  // ─── Secondary ────────────────────────────
  static const secondary = Color(0xFFF97316);
  static const secondaryLight = Color(0xFFFBBF24);

  // ─── Role Accent Colors ───────────────────
  static const workerAccent = Color(0xFF1E3A8A);
  static const employerAccent = Color(0xFF7C3AED);
  static const customerAccent = Color(0xFF0D9488);

  // ─── Surfaces (light theme) ───────────────
  static const surface1 = Color(0xFFF8FAFC);
  static const surface2 = Color(0xFFF1F5F9);
  static const surface3 = Color(0xFFE2E8F0);

  // ─── Text ─────────────────────────────────
  static const textPrimary = Color(0xFF0F172A);
  static const textSecondary = Color(0xFF475569);
  static const textTertiary = Color(0xFF94A3B8);

  // ─── Semantic ─────────────────────────────
  static const success = Color(0xFF10B981);
  static const warning = Color(0xFFF59E0B);
  static const error = Color(0xFFEF4444);
  static const info = Color(0xFF3B82F6);

  // ─── Gradients ────────────────────────────
  static const primaryGradient = LinearGradient(
    colors: [Color(0xFF1E3A8A), Color(0xFF3B82F6)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const workerGradient = LinearGradient(
    colors: [Color(0xFF1E3A8A), Color(0xFF2563EB)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const employerGradient = LinearGradient(
    colors: [Color(0xFF7C3AED), Color(0xFFA855F7)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const customerGradient = LinearGradient(
    colors: [Color(0xFF0D9488), Color(0xFF14B8A6)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const heroGradient = LinearGradient(
    colors: [Color(0xFF0B1120), Color(0xFF1E3A8A)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
