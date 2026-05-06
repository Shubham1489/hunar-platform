# Hunar Mobile — AI-Powered Blue-Collar Job Platform

<p align="center">
  <b>Connecting skilled workers with employers through AI-powered matching</b>
</p>

---

## 🏗️ Architecture Overview

```
apps/mobile/
├── lib/
│   ├── main.dart                 # Entry point
│   ├── app.dart                  # Root MaterialApp with theme
│   ├── core/
│   │   ├── api/
│   │   │   ├── api_client.dart   # Dio HTTP client + JWT interceptor
│   │   │   └── api_endpoints.dart # 50+ REST API endpoint constants
│   │   ├── auth/
│   │   │   └── auth_provider.dart # Riverpod auth state (OTP, JWT, roles)
│   │   ├── router/
│   │   │   └── app_router.dart   # GoRouter with auth guards + role routing
│   │   └── theme/
│   │       ├── app_theme.dart    # Material 3 theme from Stitch design system
│   │       └── app_colors.dart   # Color palette + role gradients
│   └── features/
│       ├── auth/                 # Role Selection → Phone → OTP screens
│       ├── worker/               # Dashboard, Jobs, Applications, Profile, Earnings, Settings
│       ├── employer/             # Dashboard, Jobs, Post Job, Applicants, Workers, Analytics
│       ├── customer/             # Dashboard, Services, Workers, Booking, Bookings, Profile
│       └── shared/               # BottomNavShell, SharedWidgets
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
├── test/
└── pubspec.yaml
```

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Flutter SDK | ≥ 3.7.0 |
| Dart SDK | ≥ 3.7.0 |
| Android Studio / Xcode | Latest |
| Node.js (for backend) | ≥ 18.0 |

### 1. Clone & Install

```bash
git clone https://github.com/your-org/hunar.git
cd hunar/apps/mobile
flutter pub get
```

### 2. Start the Backend (required for API calls)

```bash
# Terminal 1 — Fastify API server
cd apps/api
npm install
npm run dev          # → http://localhost:3001

# Terminal 2 — FastAPI AI service
cd services/ai
pip install -r requirements.txt
uvicorn main:app --port 8000   # → http://localhost:8000
```

### 3. Run the Mobile App

```bash
# Android emulator
flutter run -d emulator

# iOS simulator
flutter run -d iphone

# Chrome (debug)
flutter run -d chrome
```

> **Note:** The app uses `http://10.0.2.2:3001` for Android emulator which maps to the host's `localhost:3001`.

## 📱 Features by Role

### 🔧 Worker
| Feature | Screen | AI Integration |
|---------|--------|----------------|
| Dashboard | Earnings card, quick actions, AI job feed | ✅ Match scoring |
| Job Search | Filter by city, AI match badges | ✅ Recommendations |
| Job Detail | Sliver header, skills, benefits | — |
| Applications | Tab bar (All/Applied/Shortlisted/Hired) | — |
| Profile | Voice-to-skill extraction | ✅ Speech-to-text |
| Earnings | Bar chart, transaction history | — |
| Settings | Notifications, security, language | — |

### 🏢 Employer
| Feature | Screen | AI Integration |
|---------|--------|----------------|
| Dashboard | Hiring overview, quick actions | — |
| Jobs | Active/closed jobs list | — |
| Post Job | 3-step wizard with salary preview | ✅ AI salary prediction |
| Applicants | AI-ranked candidate list | ✅ Match scoring |
| Worker Directory | Search, filter, send offers | — |
| Analytics | Hiring funnel, top skills | — |

### 🏠 Customer
| Feature | Screen | AI Integration |
|---------|--------|----------------|
| Dashboard | Service grid, active bookings | — |
| Services | UrbanClap-style category grid | — |
| Worker Search | Nearby workers with filters | — |
| Booking | 3-step: service → schedule → payment | — |
| Bookings | OTP completion, ratings | — |
| Profile | Addresses, stats | — |

## 🤖 AI Integrations

### Voice Skill Extraction
```dart
// Worker can speak skills in Hindi/English
// App sends audio to /ai/extract-skills endpoint
await _stt.listen(localeId: 'hi_IN', listenFor: Duration(seconds: 10));
// AI extracts: "main electrician hoon, wiring aur panel board karta hoon"
// → Skills: ['Electrician', 'Wiring', 'Panel Board']
```

### Job-Worker Matching
```
POST /ai/recommendations
{
  "workerId": "worker_123",
  "skills": ["Wiring", "MCB"],
  "location": "Mumbai"
}
→ Returns ranked jobs with match % scores
```

### Applicant Ranking
```
POST /ai/rank-applicants
{
  "jobId": "job_456",
  "requiredSkills": ["Wiring", "Panel Board"]
}
→ Returns applicants ranked by skill match + experience + rating
```

## 🔒 Security

- **JWT tokens** stored in hardware-backed secure storage (Keychain/Keystore)
- **Automatic token refresh** via Dio interceptor (401 → retry with new token)
- **No hardcoded API keys** — all secrets via environment variables
- **Input validation** on all form fields before API submission
- **OTP-based auth** — no password storage

## 🎨 Design System

Ported from the web **Stitch design system** to Flutter Material 3:

| Token | Value |
|-------|-------|
| Primary | `#6C5CE7` (Indigo) |
| Worker Accent | `#00B894` (Emerald) |
| Employer Accent | `#6C5CE7` (Purple) |
| Customer Accent | `#E17055` (Coral) |
| Font | Plus Jakarta Sans / Google Fonts |
| Corner Radius | 16px (cards), 12px (buttons) |
| Shadows | `0 4px 12px rgba(0,0,0,0.04)` |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Flutter 3.7+ |
| State Management | Riverpod 2 (Notifier) |
| Networking | Dio + JWT Interceptor |
| Navigation | GoRouter (role-based, auth guards) |
| Local Storage | Hive + FlutterSecureStorage |
| Icons | Lucide Icons Flutter |
| Voice | speech_to_text |
| Payments | razorpay_flutter |
| Maps | google_maps_flutter + Geolocator |

## 🏗️ Building for Production

### Android (APK / AAB)

```bash
# APK
flutter build apk --release

# App Bundle (Google Play)
flutter build appbundle --release
```

### iOS (IPA)

```bash
flutter build ios --release
# Then archive in Xcode
```

### Environment Variables

Create `apps/mobile/.env` for production:

```env
API_BASE_URL=https://api.hunar.app
AI_SERVICE_URL=https://ai.hunar.app
RAZORPAY_KEY=rzp_live_xxxxx
GOOGLE_MAPS_KEY=AIzaSy_xxxxx
```

## 🧪 Testing

```bash
# Unit tests
flutter test

# Integration tests
flutter test integration_test/

# With coverage
flutter test --coverage
```

## 📁 Project Structure Conventions

- **Feature-first** architecture (not layer-first)
- Each feature has `screens/`, `widgets/`, `providers/`, and `models/` subdirectories
- All API calls go through `ApiClient` — never use raw `http` calls
- All navigation via `GoRouter` — never use `Navigator.push` directly
- All colors from `AppColors` — no inline color values
- All text styles from `Theme.of(context).textTheme` — no inline styles

## 📄 License

MIT License — see [LICENSE](../../LICENSE) for details.
