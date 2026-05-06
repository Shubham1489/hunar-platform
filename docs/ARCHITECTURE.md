# Hunar — Code Architecture & Explanation

This document provides a detailed walkthrough of the Hunar codebase for developers who want to understand, extend, or maintain the platform.

---

## Table of Contents

- [Monorepo Structure](#monorepo-structure)
- [Backend API — Deep Dive](#backend-api--deep-dive)
- [AI/ML Service — Deep Dive](#aiml-service--deep-dive)
- [Frontend — Deep Dive](#frontend--deep-dive)
- [Shared Package](#shared-package)
- [Data Flow Examples](#data-flow-examples)
- [Design Decisions](#design-decisions)

---

## Monorepo Structure

Hunar uses **Turborepo** with npm workspaces. The monorepo provides:

- **Shared dependencies** — Common packages installed once at root
- **Parallel execution** — `turbo dev` runs all apps simultaneously
- **Build pipeline** — Optimized build order respecting dependencies
- **Shared code** — `@hunar/shared` is imported by both API and web apps

```
turbo.json           → Pipeline configuration (dev, build, lint, test)
package.json         → Root workspace with scripts
apps/api/            → Backend (depends on @hunar/shared)
apps/web/            → Frontend (depends on @hunar/shared)
apps/ai-service/     → Python ML service (independent)
packages/shared/     → Shared TypeScript code
```

### How `turbo.json` Works

```json
{
  "pipeline": {
    "dev":   { "cache": false, "persistent": true },  // Run servers
    "build": { "dependsOn": ["^build"] },              // Build in order
    "lint":  {},                                        // Run independently
    "test":  { "dependsOn": ["build"] }                // Test after build
  }
}
```

---

## Backend API — Deep Dive

### Server Bootstrap (`apps/api/src/server.ts`)

The Fastify server initializes in this order:

```
1. Load environment variables
2. Register plugins (CORS, Helmet, Rate-Limit, Swagger)
3. Register middleware (error handler)
4. Register route modules (auth, workers, jobs, etc.)
5. Start listening on PORT
```

### Module Pattern

Every API module follows this consistent pattern:

```
modules/<name>/
├── <name>.routes.ts     — Route definitions & handlers
├── <name>.service.ts    — Business logic (optional, may be inline)
└── <name>.schema.ts     — Zod validation schemas (optional)
```

### Authentication Flow

```
┌─────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│  Client  │──1──→│  /auth/  │──2──→│  Redis   │──3──→│ Postgres │
│          │      │ req-otp  │      │ (rate    │      │ (store   │
│          │      │          │      │  limit)  │      │  OTP)    │
└────┬─────┘      └──────────┘      └──────────┘      └──────────┘
     │
     │ ← SMS with 6-digit OTP (or console log in dev)
     │
     │         ┌──────────┐       ┌──────────┐
     │──4───→  │  /auth/  │──5──→│ Postgres │
     │         │ verify   │      │ (verify  │
     │         │          │      │  OTP)    │
     │         └────┬─────┘      └──────────┘
     │              │
     │              │──6──→ Create/find User
     │              │──7──→ Generate JWT (access + refresh)
     │              │
     │ ← { accessToken, refreshToken, user }
```

**Key security details:**
- OTPs are hashed with SHA-256 before storage (never plain text)
- OTPs expire after 10 minutes with max 3 attempts
- Rate limited to 5 OTP requests per phone per hour
- JWT uses RS256 algorithm with separate access/refresh secrets
- Refresh tokens are one-time-use (rotated on refresh)
- Invalidated tokens are blacklisted in Redis

### Middleware Chain

Every authenticated request passes through:

```
Request → Rate Limiter → Auth Middleware → RBAC Middleware → Route Handler
                              │                  │
                         Verify JWT          Check role
                         from header         permissions
```

**`authenticate.ts`** — Extracts the JWT from `Authorization: Bearer <token>`, verifies the signature, checks if it's blacklisted in Redis, and attaches the `user` object to the request.

**`authorize.ts`** — A factory function that returns middleware checking if `request.user.role` is in the allowed roles list:

```typescript
// Usage in routes:
{ preHandler: [authenticate, authorize('EMPLOYER', 'ADMIN')] }
```

### Database Layer (Prisma)

Prisma provides:
- **Type safety** — Every query returns TypeScript-typed results
- **Migrations** — Schema changes create versioned SQL migration files
- **Relations** — Nested reads/writes across related tables
- **pgvector** — Vector similarity search (for future embedding-based matching)

**Singleton pattern** (`lib/prisma.ts`):
```typescript
// Prevents multiple Prisma instances in development (hot reload)
const globalForPrisma = globalThis as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Payment Flow (Razorpay + Escrow)

```
Customer                    API                     Razorpay
   │                        │                          │
   │──1. POST /initiate───→│                          │
   │                        │──2. Create order───────→│
   │                        │←─────── order_id ───────│
   │←── { orderId } ───────│                          │
   │                        │                          │
   │──3. Pay on Razorpay──→│                          │
   │                        │                          │
   │                        │←─4. Webhook (paid)──────│
   │                        │   (verify signature)     │
   │                        │   Status → HELD          │
   │                        │                          │
   │──5. Worker completes──→│                          │
   │  (OTP verified)        │   Status → RELEASED      │
   │                        │   (payout to worker)     │
```

---

## AI/ML Service — Deep Dive

### Architecture

The AI service is a **standalone Python FastAPI** application that the Node.js API calls via HTTP. This decoupling provides:

- **Independent scaling** — AI can run on GPU instances
- **Language flexibility** — Python for ML, Node.js for API
- **Independent deployment** — Deploy AI model updates without touching the API

### Recommendation Engine (`routers/recommend.py`)

**Algorithm: Hybrid Content-Based Filtering**

```python
final_score = (
    0.6 × skill_similarity  +  # Cosine similarity of TF-IDF vectors
    0.3 × location_score    +  # Inverse haversine distance (50km radius)
    0.1 × recency_bonus        # Exponential decay over 30 days
)
```

**Step-by-step:**
1. Build TF-IDF vectors from worker skills and job `skillsRequired`
2. Compute cosine similarity between worker vector and each job vector
3. Calculate haversine distance between worker and job locations
4. Convert distance to score: `max(0, 1 - distance/50)`
5. Add recency bonus: `exp(-days_since_posted / 30)`
6. Sort by final score, return top N

### Skill Extraction (`routers/extract_skills.py`)

**Pipeline: Voice/Text → Structured Skills**

```
Input: "main electrician hoon, wiring ka kaam karta hoon, smart home bhi"
  │
  ├── 1. Language Detection (langdetect)
  │     → "hi" (Hindi)
  │
  ├── 2. Translation (googletrans)
  │     → "I am an electrician, I do wiring work, smart home too"
  │
  ├── 3. Tokenize + Lowercase
  │     → ["electrician", "wiring", "work", "smart", "home"]
  │
  ├── 4. N-gram generation (unigrams + bigrams)
  │     → ["electrician", "wiring", "smart home", ...]
  │
  ├── 5. Fuzzy match against skill taxonomy (80% threshold)
  │     → Electrician: 100%, Wiring: 100%, Smart Home: 95%
  │
  └── Output: [
        { "skill": "Electrician", "confidence": 1.0 },
        { "skill": "Wiring", "confidence": 1.0 },
        { "skill": "Smart Home", "confidence": 0.95 }
      ]
```

### Salary Prediction (`routers/predict_salary.py`)

**Model: Rule-based (XGBoost-ready architecture)**

```python
base_rate = skill_base_rates[primary_skill]    # e.g., Electrician = ₹600
experience_mult = 1 + (years * 0.06)            # +6% per year, capped at 2x
city_mult = { "tier1": 1.3, "tier2": 1.0, "tier3": 0.8 }[city_tier]
type_mult = { "permanent": 0.9, "contract": 1.0, "oneday": 1.15 }[job_type]

daily_rate = base_rate × experience_mult × city_mult × type_mult

return {
  "min": daily_rate × 0.85,
  "median": daily_rate,
  "max": daily_rate × 1.2
}
```

### Applicant Ranking (`routers/rank_applicants.py`)

```python
score = (
    0.7 × skill_cosine_similarity +  # How well skills match job requirements
    0.2 × experience_score +          # Normalized years (capped at 15)
    0.1 × rating_score                # Normalized rating (0-5 → 0-1)
)
```

---

## Frontend — Deep Dive

### Design System (`globals.css`)

The design system establishes visual consistency through CSS custom properties:

```css
:root {
  /* Brand Colors (from Stitch design spec) */
  --primary: #1E3A8A;       /* Deep Indigo — trust, professionalism */
  --secondary: #F97316;     /* Sunrise Orange — energy, action */
  --tertiary: #0D9488;      /* Teal — growth, service */

  /* Tonal Surface Layering ("No-Line Rule") */
  --surface-0: #FFFFFF;     /* Base layer */
  --surface-1: #F8FAFC;     /* Raised layer */
  --surface-2: #F1F5F9;     /* Higher emphasis */
  --surface-3: #E2E8F0;     /* Highest emphasis */
}
```

**"No-Line Rule"** — Instead of 1px borders, we use tonal surface differences to create visual hierarchy. A card sitting on `surface-1` has a `surface-0` background with `shadow-md`, creating depth without any visible borders.

### State Management (Zustand)

```typescript
// Zustand store pattern — simple, no boilerplate
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));

// Usage in any component
const { user, login, logout } = useAuthStore();
```

### API Client (`lib/api.ts`)

The Axios client handles:
1. **Base URL** — Points to the API server
2. **Auth header** — Automatically attaches JWT from the store
3. **Token refresh** — On 401, silently refreshes the token and retries
4. **Error handling** — Transforms API errors to user-friendly messages

### Page Architecture

Each page follows this pattern:
```
'use client';              // Client-side rendering for interactivity
import { useState, ... }   // React hooks for state
import { ... } from 'lucide-react';  // Icon library

// Mock data (to be replaced with API calls)
const MOCK_DATA = [...]

export default function PageName() {
  return (
    <div style={{ display: 'flex' }}>
      <aside>Sidebar Navigation</aside>
      <main>Page Content</main>
    </div>
  );
}
```

---

## Shared Package

`packages/shared/` contains code shared between API and frontend:

### Enums (`types/enums.ts`)
```typescript
export enum Role { WORKER = 'WORKER', EMPLOYER = 'EMPLOYER', ... }
export enum JobStatus { DRAFT = 'DRAFT', OPEN = 'OPEN', ... }
```

### Schemas (`schemas/`)
```typescript
// Zod schemas for runtime validation
export const loginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  role: z.nativeEnum(Role),
});
```

### Constants (`constants/`)
```typescript
export const MAX_SKILLS_PER_WORKER = 15;
export const OTP_LENGTH = 6;
export const PLATFORM_FEE_PERCENT = 10;
```

---

## Data Flow Examples

### Worker Applies to Job

```
1. Worker clicks "Apply" on job card
2. Frontend → POST /api/v1/jobs/:id/apply
3. Auth middleware verifies JWT, checks role = WORKER
4. Route handler:
   a. Validates job exists and is OPEN
   b. Checks worker hasn't already applied
   c. Calls AI service: POST /rank-applicants (to get match score)
   d. Creates JobApplication with aiMatchScore
   e. Sends notification to employer
5. Returns 201 { application, matchScore }
```

### Customer Books a Worker

```
1. Customer searches workers by skill + location
2. Frontend → GET /api/v1/customers/workers?skill=Electrician&lat=28.6&lng=77.2
3. API queries WorkerProfile with haversine distance filter
4. Customer clicks "Book" → POST /api/v1/customers/bookings
5. API:
   a. Creates ServiceRequest
   b. Creates Booking (status: PENDING)
   c. Sends notification to worker
6. Worker accepts → status: CONFIRMED
7. Worker arrives, completes work
8. Customer generates OTP → POST /bookings/:id/complete
9. Worker enters OTP → verified → status: COMPLETED
10. Payment released from escrow to worker
```

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| **OTP over password** | Most blue-collar workers don't use email; phone is universal |
| **Fastify over Express** | 2x faster, built-in schema validation, TypeScript-first |
| **Prisma over raw SQL** | Type safety, auto-generated migrations, visual studio |
| **Separate AI service** | Python ML ecosystem is superior; independent scaling |
| **JWT RS256 over HS256** | Asymmetric keys allow token verification without secret sharing |
| **Zustand over Redux** | Minimal boilerplate, no reducers, better DX for small-medium apps |
| **CSS tokens over Tailwind** | Full control over design system; Stitch spec requires custom tokens |
| **Escrow payments** | Protects both parties; worker gets paid only after verified completion |
| **Turborepo** | Faster builds with caching; shared dependencies across workspaces |
| **pgvector extension** | Future-proof for embedding-based semantic skill matching |
