# Hunar — AI-Powered Blue-Collar Job Platform: Full-Stack Implementation Plan

## 1. Overview & Background

**Hunar** is an AI-powered digital labour marketplace targeting India's 450M blue-collar workforce. It connects three user roles — **Workers**, **Employers**, and **Customers** — using ML-based recommendations, voice-to-skill extraction, and salary prediction.

The project documentation spans 14 comprehensive documents covering SRS, PRD, System Design, User Flows, Features, Tech Stack, Architecture, API Structure, API Endpoints, Database Schema, Prisma Models, Authentication, Business Logic, and AI Documentation. Additionally, 59 Stitch UI designs exist covering landing pages, dashboards, registration flows, job search, and all major screens.

---

## 2. User Review Required

> [!IMPORTANT]
> **Monorepo Structure**: The docs specify a monorepo with `apps/web` (Next.js), `apps/api` (Node.js/Fastify), and `apps/ai-service` (Python/FastAPI). We will scaffold all three inside the workspace. The Flutter mobile app (`apps/mobile`) is **deferred** to a later phase since you have prior conversation history for it.

> [!IMPORTANT]
> **Third-Party API Keys**: The following services require API keys for full functionality. We will build with mock/placeholder support and env-var configuration:
> - **Razorpay** (payments) — mock payment flow initially
> - **MSG91/Twilio** (SMS OTP) — console-logged OTP in dev mode
> - **Firebase** (FCM push notifications) — stubbed
> - **Google Maps** (location services) — stubbed with mock coordinates
> - **Google Cloud Speech-to-Text** — browser Web Speech API used as primary

> [!WARNING]
> **AI Model Training Data**: The XGBoost salary prediction and ALS collaborative filtering models require historical data. Phase 1 will use content-based filtering only (P0 spec). Collaborative filtering and XGBoost salary models will use synthetic seed data for development.

> [!IMPORTANT]
> **Database**: We will use PostgreSQL 15 with Prisma ORM as specified. Docker Compose will provision PostgreSQL + Redis locally for development.

---

## 3. Proposed Architecture

```
hunar/
├── apps/
│   ├── web/                    # Next.js 14 (App Router) — Frontend
│   │   ├── app/
│   │   │   ├── (auth)/         # Login, Register, OTP Verify, Lockscreen
│   │   │   ├── (worker)/       # Worker Dashboard, Jobs, Applications, Profile
│   │   │   ├── (employer)/     # Employer Dashboard, Post Job, Applicants
│   │   │   ├── (customer)/     # Customer Dashboard, Browse Workers, Bookings
│   │   │   ├── (admin)/        # Admin Panel, Users, Analytics, Disputes
│   │   │   └── api/            # BFF route handlers
│   │   ├── components/         # Shared React components
│   │   ├── lib/                # Utilities, API client, stores
│   │   └── public/             # Static assets
│   │
│   ├── api/                    # Node.js/Fastify — Core REST API
│   │   ├── src/
│   │   │   ├── modules/        # auth, workers, jobs, employers, customers, 
│   │   │   │                   # payments, ratings, notifications, admin
│   │   │   ├── middleware/     # JWT auth, RBAC, rate-limit, validation
│   │   │   ├── plugins/       # Fastify plugins (cors, swagger, etc.)
│   │   │   ├── utils/         # Helpers, error handler, logger
│   │   │   └── server.ts      # Entry point
│   │   └── prisma/
│   │       └── schema.prisma   # Database schema
│   │
│   └── ai-service/             # Python/FastAPI — AI/ML Microservice
│       ├── app/
│       │   ├── routers/        # recommend, extract_skills, predict_salary, rank_applicants
│       │   ├── models/         # ML model classes
│       │   ├── services/       # Business logic for ML
│       │   ├── utils/          # Helpers
│       │   └── main.py         # FastAPI entry
│       ├── data/               # Seed data, skill taxonomy
│       ├── tests/
│       └── requirements.txt
│
├── packages/
│   └── shared/                 # Shared TypeScript types, Zod schemas, constants
│       ├── src/
│       │   ├── types/          # API response types, entity types
│       │   ├── schemas/        # Zod validation schemas
│       │   └── constants/      # Enums, skill taxonomy, error codes
│       └── package.json
│
├── infra/
│   ├── docker-compose.yml      # PostgreSQL, Redis, services
│   └── nginx/                  # Reverse proxy config
│
├── .env.example
├── package.json                # Root monorepo config (npm workspaces)
└── turbo.json                  # Turborepo build pipeline
```

---

## 4. Proposed Changes — Phased Approach

### Phase 1: Foundation & Infrastructure
**Goal**: Scaffold monorepo, database, and core shared packages.

#### [NEW] Root monorepo files
- `package.json` (npm workspaces: apps/*, packages/*)
- `turbo.json` (build pipeline config)
- `.env.example` (all env vars documented)
- `.gitignore`

#### [NEW] `infra/docker-compose.yml`
- PostgreSQL 15 with pgvector extension
- Redis 7 for cache/sessions/rate-limiting
- Networking between services

#### [NEW] `packages/shared/`
- TypeScript types matching all API entities (User, Worker, Job, Booking, Payment, Rating)
- Zod schemas for all request/response validation
- Constants: enums, skill categories, error codes
- Shared between `apps/web` and `apps/api`

---

### Phase 2: Backend API (Node.js/Fastify)
**Goal**: Build the complete REST API with all modules specified in docs 08-09.

#### [NEW] `apps/api/` — Fastify Core API

##### Auth Module (`src/modules/auth/`)
- `POST /auth/request-otp` — OTP generation, rate-limited (5/hr/phone), hashed storage
- `POST /auth/verify-otp` — Verify + JWT issue (RS256, 24h access, 30d refresh)
- `POST /auth/refresh` — Rotating refresh tokens
- `POST /auth/logout` — Token blacklist in Redis
- `GET /auth/me` — Current user from JWT

##### Workers Module (`src/modules/workers/`)
- `GET /workers/:id` — Public profile
- `PUT /workers/me` — Update profile
- `GET /workers/me/recommendations` — AI job feed (proxy to ai-service, Redis-cached)
- `POST /workers/me/skills` — Text skill addition with taxonomy matching
- `POST /workers/me/skills/voice` — Voice skill extraction (proxy to ai-service)
- `DELETE /workers/me/skills/:skill_id`
- `PUT /workers/me/availability` — Freelance toggle
- `GET /workers/me/applications`
- `GET /workers/me/bookings`
- `GET /workers/me/earnings`
- `POST /workers/me/otp-confirm` — Job completion OTP verification

##### Jobs Module (`src/modules/jobs/`)
- Full CRUD + apply/withdraw + applicant listing with AI ranking

##### Employers Module (`src/modules/employers/`)
- Profile CRUD + job management + worker directory + direct offers + analytics

##### Customers Module (`src/modules/customers/`)
- Profile + service requests + worker search + bookings + OTP completion + disputes + ratings

##### Payments Module (`src/modules/payments/`)
- Razorpay order creation, signature verification, webhook receiver, escrow logic, refunds

##### Ratings Module (`src/modules/ratings/`)
- Submit, list, report — with worker average recalculation trigger

##### Notifications Module (`src/modules/notifications/`)
- List, mark-read, preferences — BullMQ event-driven

##### Admin Module (`src/modules/admin/`)
- User management, disputes, analytics, export

##### Middleware (`src/middleware/`)
- `authenticate.ts` — JWT verification with Redis blacklist check
- `authorize.ts` — RBAC role guard
- `rateLimiter.ts` — Redis sliding window (100 req/min auth, 20 req/min unauth)
- `validate.ts` — Zod schema validation
- `errorHandler.ts` — Standardized error response format

#### [NEW] `apps/api/prisma/schema.prisma`
- Full schema from doc 10-11: Users, OTP, WorkerProfiles, Skills, WorkerSkills, EmployerProfiles, JobPostings, JobApplications, CustomerProfiles, ServiceRequests, Bookings, Payments, Ratings, Notifications
- All enums, indexes, and relationships as specified

---

### Phase 3: AI/ML Service (Python/FastAPI)
**Goal**: Build the ML microservice with all four AI endpoints.

#### [NEW] `apps/ai-service/`

##### Recommendation Engine (`routers/recommend.py`)
- Content-based filtering with TF-IDF skill vectors + cosine similarity
- Location scoring via Haversine distance
- Hybrid scoring formula: `0.6 × content + 0.3 × collab + 0.1 × recency`
- Cold-start handling (content-only for <5 applications)
- Redis caching (1hr TTL per worker)

##### Skill Extraction (`routers/extract_skills.py`)
- Language detection via `langdetect`
- Translation via `deep-translator`
- NER skill extraction via spaCy
- Fuzzy taxonomy matching via `rapidfuzz` (80% threshold)
- Returns: `[{skill_id, name_en, confidence}]`

##### Salary Prediction (`routers/predict_salary.py`)
- XGBoost regression model
- Features: skills (one-hot), experience_years, city_tier, job_type
- Output: `{daily_rate_min, daily_rate_median, daily_rate_max}`
- Seed model with synthetic training data

##### Applicant Ranking (`routers/rank_applicants.py`)
- Cosine similarity (reverse perspective of recommendation)
- Experience bonus (+5 if meets minimum)
- Rating tiebreaker
- 30-min Redis cache per job

##### Skill Taxonomy (`data/skills_taxonomy.json`)
- ~500 skills across categories: Electrical, Plumbing, Carpentry, Painting, HVAC, etc.
- English name, Hindi name, aliases for matching

---

### Phase 4: Web Frontend (Next.js 14)
**Goal**: Build the complete web UI matching Stitch designs with all role-specific flows.

#### [NEW] `apps/web/` — Next.js 14 App Router

##### Design System (matching Stitch design document)
- **Colors**: Deep Indigo primary (#00236f / #1E3A8A), Sunrise Orange secondary (#F97316), Teal tertiary (#0D9488)
- **Typography**: Plus Jakarta Sans (headlines), Inter (body)
- **No-line rule**: No 1px borders — tonal surface layering
- **Glass & gradient**: Glassmorphism for modals; gradient CTAs
- **Roundness**: 8px default, large pill-shaped inputs

##### Auth Pages
- Landing page (full marketing page matching Stitch design)
- Login with role selection (Worker/Employer/Customer)
- OTP verification
- Role-specific registration wizards
- Lockscreen
- Logout confirmation

##### Worker Dashboard & Pages
- Dashboard: earnings overview, rating, next scheduled job, earnings chart, AI job feed
- Job discovery with AI match score badges
- Job detail with apply action
- Application tracker (Applied → Shortlisted → Hired/Rejected)
- Profile editor with voice skill input
- OTP job completion flow
- Earnings/wallet view

##### Employer Dashboard & Pages
- Dashboard: active jobs, total applicants, hired count, recent applicants
- Post a Job (3-step wizard: Details → Requirements → Review)
- Applicant review with AI match scores
- Worker directory browser
- Company profile editor

##### Customer Dashboard & Pages
- Service request with category grid
- Worker search results (list + map)
- Worker profile view
- Booking flow with payment
- OTP share for completion
- Rate & review form
- Booking history

##### Admin Panel
- User management table
- Dispute resolution
- Analytics dashboard with charts
- Commission configuration

##### Shared Components
- Navigation (sidebar for dashboards, top nav for public pages)
- Job cards, worker cards, booking cards
- Skill chips, match score badges
- Search inputs with filters
- Loading shimmer skeletons
- Notification bell with dropdown
- Payment method selector
- OTP input component
- Rating stars
- Data tables with pagination

---

## 5. Tech Stack Summary (from Doc 06)

| Layer | Technology |
|-------|-----------|
| Frontend Web | Next.js 14, TypeScript, TailwindCSS 3, shadcn/ui, Zustand, React Query, React Hook Form + Zod |
| Backend API | Node.js 20, Fastify 4, TypeScript, Prisma 5, BullMQ |
| AI/ML Service | Python 3.11, FastAPI, scikit-learn, spaCy, XGBoost, rapidfuzz |
| Database | PostgreSQL 15 + pgvector, Redis 7 |
| DevOps | Docker Compose (dev), nginx proxy |
| Testing | Vitest + Playwright (web), Jest + Supertest (API), pytest (AI) |

---

## 6. Security Compliance (from Docs 05, 12)

- ✅ OWASP Top 10 compliance
- ✅ JWT RS256 with token rotation and Redis blacklist
- ✅ OTP hashed (SHA-256) with rate limiting (5/hr, 3 attempts)
- ✅ RBAC middleware on every route
- ✅ Input validation via Zod on all endpoints
- ✅ Parameterized queries via Prisma (no raw SQL)
- ✅ Rate limiting: 100 req/min auth, 20 req/min unauth
- ✅ CORS whitelist
- ✅ No plaintext OTPs/passwords stored
- ✅ No hardcoded API keys (process.env only)
- ✅ PII field-level encryption for phone/Aadhaar
- ✅ Razorpay webhook signature verification

---

## 7. Open Questions

> [!IMPORTANT]
> 1. **Deployment Target**: Do you want Docker Compose for local dev only, or should I also configure AWS EKS/Terraform manifests for production deployment?

> [!IMPORTANT]
> 2. **Razorpay Test Mode**: Shall I integrate with Razorpay test keys and build the full payment flow, or mock the payment entirely for now?

> [!IMPORTANT]
> 3. **SMS Provider**: Should I integrate a real SMS provider (MSG91 test mode) for OTP, or use console logging for development?

> [!IMPORTANT]
> 4. **Flutter Mobile Application**: The docs mention a Flutter app. Your prior conversation already covers Flutter work. Should I skip `apps/mobile` entirely in this build, or scaffold a basic Flutter structure?

> [!IMPORTANT]
> 5. **Seed Data**: Should I create comprehensive seed data (dummy workers, jobs, employers, customers) for demo purposes?

---

## 8. Verification Plan

### Automated Tests
- **API**: `npm run test` in `apps/api` — Jest + Supertest covering all endpoints
- **AI Service**: `pytest` covering all ML endpoints with sample inputs
- **Web**: `npm run test` — Vitest for component tests
- **E2E**: Playwright tests for critical user flows (register → login → apply to job)

### Dev Server Validation
- `docker-compose up` — Verify PostgreSQL + Redis start
- `npm run dev` — All three services running concurrently
- Browser walkthrough of each user role flow
- API endpoint testing via Swagger docs (auto-generated at `/docs`)

### Manual Verification
- Visual comparison of UI against Stitch designs
- OTP flow end-to-end (console output in dev)
- AI recommendation quality check with seed data
