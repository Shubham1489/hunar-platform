# Hunar Web Frontend

The Next.js web application for the Hunar platform.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS 4 + Custom Design Tokens
- **State:** Zustand
- **HTTP:** Axios (with JWT interceptors)
- **Icons:** Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# ✅ http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                     # Root layout with SEO metadata
│   ├── page.tsx                       # Landing page (hero, categories, AI features)
│   ├── globals.css                    # Design system tokens & utilities
│   ├── login/
│   │   └── page.tsx                   # Role selection → phone input
│   ├── verify-otp/
│   │   └── page.tsx                   # 6-digit OTP verification
│   ├── worker/
│   │   └── dashboard/
│   │       └── page.tsx               # Worker dashboard
│   ├── employer/
│   │   └── dashboard/
│   │       └── page.tsx               # Employer dashboard
│   └── customer/
│       └── dashboard/
│           └── page.tsx               # Customer dashboard (UrbanClap-style)
└── lib/
    ├── api.ts                         # Axios client with JWT interceptors
    └── store.ts                       # Zustand auth store
```

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing page with hero, categories, AI features, testimonials |
| Login | `/login` | Role selection (Worker/Employer/Customer) and phone input |
| OTP Verify | `/verify-otp` | 6-digit OTP input with auto-advance and paste support |
| Worker Dashboard | `/worker/dashboard` | Earnings, AI job recommendations, applications |
| Employer Dashboard | `/employer/dashboard` | Active jobs, AI-ranked applicants, analytics |
| Customer Dashboard | `/customer/dashboard` | Service categories, bookings, nearby workers |

## Design System

The design system is defined in `globals.css` with CSS custom properties:

### Brand Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#1E3A8A` | Deep Indigo — headers, primary buttons |
| `--secondary` | `#F97316` | Sunrise Orange — CTAs, accents |
| `--tertiary` | `#0D9488` | Teal — success, customer theme |

### Typography
| Token | Font | Usage |
|-------|------|-------|
| `--font-display` | Plus Jakarta Sans | Headings, titles |
| `--font-body` | Inter | Body text, labels |

### Design Rules
1. **"No-Line Rule"** — No 1px borders. Use tonal surface layering (`--surface-0` through `--surface-4`) for visual hierarchy.
2. **Glassmorphism** — `.glass` class for frosted-glass effects.
3. **Ambient shadows** — `--shadow-sm` through `--shadow-xl` for depth.
4. **Micro-animations** — `fadeIn`, `slideUp`, `scaleIn` for page transitions.

### Component Classes
| Class | Description |
|-------|-------------|
| `.card` | Surface-0 card with shadow and hover effect |
| `.btn` | Base button |
| `.btn-primary` | Indigo filled button |
| `.btn-gradient` | Orange gradient CTA button |
| `.btn-outline` | Outlined button |
| `.chip` | Tag/badge element |
| `.match-badge` | AI match score badge (high/medium/low) |
| `.glass` | Glassmorphism effect |
| `.skeleton` | Loading shimmer animation |

## State Management

Authentication state is managed via Zustand:

```typescript
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  phone: null,
  otpId: null,
  setPhone: (phone) => set({ phone }),
  setOtpId: (otpId) => set({ otpId }),
  login: (data) => set({ user: data.user, token: data.accessToken }),
  logout: () => set({ user: null, token: null }),
}));
```

## API Client

The Axios client (`lib/api.ts`) provides:
- **Base URL** configuration from environment
- **Automatic JWT** attachment via request interceptor
- **Token refresh** on 401 responses
- **Error normalization** for consistent error handling

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001    # Backend API URL
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start dev server (Turbopack) |
| `build` | `npm run build` | Production build |
| `start` | `npm start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
