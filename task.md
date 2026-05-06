# Hunar Platform — Master To-Do List

---

## Phase 1: Foundation & Infrastructure

### 1.1 Monorepo Scaffold
- [ ] Initialize root `package.json` with npm workspaces (`apps/*`, `packages/*`)
- [ ] Create `turbo.json` for Turborepo build/dev pipeline
- [ ] Create `.env.example` with all required env vars
- [ ] Create `.gitignore` (node_modules, .env, dist, __pycache__, .next)
- [ ] Create `README.md` with project setup instructions

### 1.2 Docker & Infrastructure
- [ ] Create `infra/docker-compose.yml` (PostgreSQL 15, Redis 7, pgvector extension)
- [ ] Create `infra/nginx/nginx.conf` (reverse proxy for API + web)
- [ ] Verify docker-compose up runs successfully
- [ ] Test PostgreSQL connectivity and pgvector extension

### 1.3 Shared Packages (`packages/shared`)
- [ ] Initialize `packages/shared/` with TypeScript + build config
- [ ] Define entity types: `User`, `WorkerProfile`, `EmployerProfile`, `CustomerProfile`
- [ ] Define entity types: `Job`, `JobApplication`, `Booking`, `Payment`, `Rating`
- [ ] Create Zod schemas for all API request bodies (auth, worker, job, booking, etc.)
- [ ] Create Zod schemas for all API response shapes
- [ ] Define enums: `Role`, `WorkerMode`, `JobStatus`, `JobType`, `SalaryType`, `BookingStatus`, `PaymentMethod`, `PaymentStatus`
- [ ] Create constants: error codes, skill categories, default config values
- [ ] Build and verify package exports

---

## Phase 2: Backend API (Node.js/Fastify)

### 2.1 API Scaffold
- [ ] Initialize `apps/api/` with Fastify + TypeScript + ESLint + Prettier
- [ ] Configure `tsconfig.json` and build scripts
- [ ] Create `src/server.ts` entry point with plugin registration
- [ ] Register Fastify plugins: CORS, Swagger, multipart, rate-limit
- [ ] Configure structured logging (Pino)

### 2.2 Database (Prisma)
- [ ] Create `prisma/schema.prisma` with full schema:
  - [ ] `User` model with role enum
  - [ ] `OtpCode` model
  - [ ] `WorkerProfile` model (1:1 with User)
  - [ ] `Skill` taxonomy table
  - [ ] `WorkerSkill` join table with level + years
  - [ ] `EmployerProfile` model (1:1 with User)
  - [ ] `JobPosting` model with all fields
  - [ ] `JobApplication` model with `ai_match_score`
  - [ ] `CustomerProfile` model (1:1 with User)
  - [ ] `ServiceRequest` model
  - [ ] `Booking` model with OTP fields
  - [ ] `Payment` model with Razorpay fields
  - [ ] `Rating` model with score constraint (1-5)
  - [ ] `Notification` model
- [ ] Define all database indexes per doc spec
- [ ] Run initial migration and verify schema
- [ ] Create seed script with:
  - [ ] Skill taxonomy (~500 skills across categories)
  - [ ] Sample workers, employers, customers
  - [ ] Sample job postings
  - [ ] Sample bookings and ratings

### 2.3 Middleware
- [ ] `src/middleware/authenticate.ts` — JWT RS256 verification + Redis blacklist check
- [ ] `src/middleware/authorize.ts` — RBAC role guard (WORKER, EMPLOYER, CUSTOMER, ADMIN)
- [ ] `src/middleware/rateLimiter.ts` — Redis sliding window rate limiter
- [ ] `src/middleware/validate.ts` — Zod schema validation decorator
- [ ] `src/middleware/errorHandler.ts` — Standardized error format with request ID
- [ ] `src/middleware/requestId.ts` — X-Request-ID injection

### 2.4 Auth Module
- [ ] `POST /auth/request-otp` — Generate 6-digit OTP, hash, store, rate limit (5/hr)
- [ ] `POST /auth/verify-otp` — Verify OTP (3 attempts max), create/fetch user, issue JWT
- [ ] `POST /auth/refresh` — Rotate refresh token, issue new access token
- [ ] `POST /auth/logout` — Blacklist refresh token in Redis
- [ ] `GET /auth/me` — Return current user from JWT payload
- [ ] Implement RS256 key pair generation and management
- [ ] Implement refresh token rotation strategy
- [ ] Write unit tests for all auth endpoints

### 2.5 Workers Module
- [ ] `GET /workers/:id` — Public worker profile
- [ ] `PUT /workers/me` — Update own profile (name, photo, bio, rate, location)
- [ ] `GET /workers/me/recommendations` — Proxy to AI service, Redis cache (1hr TTL)
- [ ] `POST /workers/me/skills` — Add skill by text with taxonomy lookup
- [ ] `POST /workers/me/skills/voice` — Proxy to AI service skill extraction
- [ ] `DELETE /workers/me/skills/:skill_id` — Remove skill
- [ ] `PUT /workers/me/availability` — Toggle `is_available`
- [ ] `GET /workers/me/applications` — List with status filter + pagination
- [ ] `GET /workers/me/bookings` — List active/past bookings
- [ ] `GET /workers/me/earnings` — Earnings history + pending balance
- [ ] `POST /workers/me/otp-confirm` — Verify job completion OTP → release payment
- [ ] Write unit tests

### 2.6 Jobs Module
- [ ] `GET /jobs` — List/search with filters (skill, location, salary, type) + pagination
- [ ] `GET /jobs/:id` — Job detail
- [ ] `POST /jobs/:id/apply` — Worker applies (unique constraint enforcement)
- [ ] `DELETE /jobs/:id/apply` — Withdraw application
- [ ] `GET /jobs/:id/applicants` — Employer view: AI-ranked applicant list
- [ ] `PUT /jobs/:id/applicants/:worker_id` — Shortlist/Reject/Hire
- [ ] Write unit tests

### 2.7 Employers Module
- [ ] `GET /employers/me` — Employer profile
- [ ] `PUT /employers/me` — Update company profile
- [ ] `GET /employers/me/jobs` — List own job postings
- [ ] `POST /employers/jobs` — Create job posting
- [ ] `PUT /employers/jobs/:id` — Update job posting
- [ ] `DELETE /employers/jobs/:id` — Close/delete posting
- [ ] `GET /employers/workers` — Browse worker directory with filters
- [ ] `POST /employers/workers/:id/offer` — Direct job offer
- [ ] `GET /employers/analytics` — Job posting analytics
- [ ] Write unit tests

### 2.8 Customers Module
- [ ] `GET /customers/me` — Customer profile
- [ ] `PUT /customers/me` — Update profile
- [ ] `POST /customers/service-requests` — Create service request
- [ ] `GET /customers/service-requests/:id/workers` — Matched workers
- [ ] `GET /customers/workers` — Search workers by service + location
- [ ] `POST /customers/bookings` — Create booking (hire worker)
- [ ] `GET /customers/bookings` — List bookings with status filter
- [ ] `GET /customers/bookings/:id` — Booking detail
- [ ] `POST /customers/bookings/:id/complete` — Generate completion OTP
- [ ] `POST /customers/bookings/:id/dispute` — Raise dispute
- [ ] `POST /customers/bookings/:id/rate` — Rate and review worker
- [ ] Write unit tests

### 2.9 Payments Module
- [ ] `POST /payments/initiate` — Create Razorpay order + escrow hold
- [ ] `POST /payments/verify` — Verify Razorpay payment signature
- [ ] `GET /payments/:id` — Payment details
- [ ] `POST /payments/:id/refund` — Initiate refund (admin/dispute)
- [ ] `POST /webhooks/razorpay` — Webhook receiver with HMAC validation
- [ ] Implement escrow hold → release flow tied to OTP confirmation
- [ ] Commission calculation: `worker_payout = amount × (1 - commission_rate)`
- [ ] Write unit tests

### 2.10 Ratings Module
- [ ] `POST /ratings` — Submit rating (1-5 + review text)
- [ ] `GET /ratings/worker/:worker_id` — All ratings for a worker
- [ ] `PUT /ratings/:id/report` — Report inappropriate review
- [ ] Auto-update `worker_profiles.rating_avg` and `rating_count` on new rating
- [ ] Fake review detection: flag same customer × same worker × 7-day window
- [ ] Write unit tests

### 2.11 Notifications Module
- [ ] `GET /notifications` — List notifications with pagination
- [ ] `PUT /notifications/:id/read` — Mark as read
- [ ] `PUT /notifications/read-all` — Mark all as read
- [ ] `PUT /notifications/preferences` — Update push/SMS preferences
- [ ] Create BullMQ event consumers for: `job.applied`, `job.hired`, `booking.confirmed`, `payment.completed`, `rating.submitted`
- [ ] Write unit tests

### 2.12 Admin Module
- [ ] `GET /admin/users` — List all users with role/status filters
- [ ] `PUT /admin/users/:id/status` — Activate/suspend/ban
- [ ] `GET /admin/disputes` — List open disputes
- [ ] `PUT /admin/disputes/:id/resolve` — Resolve (refund/release/split)
- [ ] `GET /admin/analytics` — Platform overview (MAU, GMV, fill rate)
- [ ] `GET /admin/analytics/export` — CSV export
- [ ] Write unit tests

### 2.13 API Documentation
- [ ] Verify auto-generated Swagger/OpenAPI docs at `/docs`
- [ ] Ensure all request/response schemas documented
- [ ] Add example payloads for each endpoint

---

## Phase 3: AI/ML Service (Python/FastAPI)

### 3.1 Service Scaffold
- [ ] Initialize `apps/ai-service/` with FastAPI + uvicorn
- [ ] Create `requirements.txt` (fastapi, uvicorn, scikit-learn, spacy, xgboost, rapidfuzz, langdetect, deep-translator, numpy, pandas, redis, psycopg2-binary, httpx)
- [ ] Create `Dockerfile` for AI service
- [ ] Configure structured logging
- [ ] Health check endpoint `GET /health`

### 3.2 Skill Taxonomy
- [ ] Create `data/skills_taxonomy.json` with ~500 skills
- [ ] Organize by category: Electrical, Plumbing, Carpentry, Painting, HVAC, Automotive, Construction, Housekeeping, Cooking, Security, IT Support, Delivery
- [ ] Include English name, Hindi name, aliases for each skill
- [ ] Build taxonomy loader service that syncs with PostgreSQL skills table

### 3.3 Recommendation Engine
- [ ] `POST /recommend` endpoint accepting `worker_id`
- [ ] Build TF-IDF skill vector representation
- [ ] Implement cosine similarity scoring
- [ ] Implement Haversine distance calculation
- [ ] Implement content-based scoring: `0.7 × skill_match + 0.3 × location_score`
- [ ] Implement hybrid scoring formula: `0.6 × content + 0.3 × collab + 0.1 × recency`
- [ ] Implement cold-start fallback (content-only for new workers)
- [ ] Implement Redis caching with `rec:{worker_id}:{date}` key (1hr TTL)
- [ ] Cache invalidation on skill profile update / new job in worker's city
- [ ] Write pytest tests with sample worker-job matching scenarios

### 3.4 Voice-to-Skill Extraction
- [ ] `POST /extract-skills` endpoint accepting `{transcript, lang}`
- [ ] Language detection via `langdetect`
- [ ] Translation to English via `deep-translator`
- [ ] NER-based skill extraction via spaCy
- [ ] Fuzzy matching against taxonomy via `rapidfuzz` (80% threshold)
- [ ] Return: `[{skill_id, name_en, confidence}]`
- [ ] Write pytest tests with Hindi, Tamil, English, and mixed-language inputs

### 3.5 Salary Prediction
- [ ] `POST /predict-salary` endpoint accepting skills + location + experience
- [ ] Build XGBoost regression model
- [ ] Feature engineering: skills one-hot, city tier encoding, job type encoding
- [ ] Train with synthetic seed data (historical job posting salary ranges)
- [ ] Return: `{daily_rate_min, daily_rate_median, daily_rate_max}`
- [ ] Evaluation: RMSE < ₹150/day on test set
- [ ] Write pytest tests

### 3.6 Applicant Ranking
- [ ] `POST /rank-applicants` endpoint accepting `job_id`
- [ ] Cosine similarity scoring (reverse perspective)
- [ ] Experience bonus: +5 if worker meets minimum
- [ ] Rating tiebreaker for equal match scores
- [ ] Redis cache per job (30-min TTL)
- [ ] Write pytest tests

---

## Phase 4: Web Frontend (Next.js 14)

### 4.1 Project Setup
- [ ] Initialize `apps/web/` with Next.js 14 (App Router) + TypeScript
- [ ] Install dependencies: TailwindCSS, shadcn/ui, Zustand, @tanstack/react-query, react-hook-form, zod, axios, recharts, next-i18next
- [ ] Configure TailwindCSS with design system colors and typography
- [ ] Set up Google Fonts: Plus Jakarta Sans, Inter
- [ ] Create global CSS with design system tokens
- [ ] Set up Zustand stores: `authStore`, `jobStore`, `notificationStore`
- [ ] Set up React Query provider and API client with interceptors
- [ ] Create layout components: sidebar nav, top nav

### 4.2 Design System Components
- [ ] Button component (primary, secondary, tertiary variants; gradient CTA)
- [ ] Input component (text, phone, OTP; pill-shaped search variant)
- [ ] Card component (no-border, tonal layering, ambient shadow)
- [ ] Chip component (skill tags, category tags)
- [ ] Badge component (AI match score: green >80%, yellow 50-80%, grey <50%)
- [ ] Avatar component
- [ ] Modal/Dialog with glassmorphism
- [ ] Loading shimmer skeletons
- [ ] Data table with pagination
- [ ] Rating stars (readonly + interactive)
- [ ] Notification bell dropdown
- [ ] OTP input (6-digit boxes)
- [ ] File upload (avatar/document)
- [ ] Map component (placeholder)

### 4.3 Auth Pages (matching Stitch designs)
- [ ] Landing page — Hero, How It Works, Categories, Featured Professionals, On-Demand Help, CTA, Footer
- [ ] Login page — Role selector + phone OTP + Google OAuth
- [ ] OTP verification page
- [ ] Worker registration wizard (5-step: basic info → skills → experience → location → rate)
- [ ] Employer registration wizard (basic info → company info → verification → preferences → success)
- [ ] Customer registration wizard (personal info → interests → success)
- [ ] Lockscreen (PIN/OTP re-auth)
- [ ] Logout success page

### 4.4 Worker Pages
- [ ] Worker dashboard — Earnings card, Jobs Completed, Rating, Next Scheduled Job map, Earnings Trend chart, AI Job Feed
- [ ] Job discovery feed — AI-ranked cards with match % badges
- [ ] Job detail page — Full JD, company info, apply button
- [ ] My Applications — Status tracker (Applied → Shortlisted → Hired/Rejected)
- [ ] Worker profile editor — Avatar upload, skills (text + voice mic), experience, rates
- [ ] Voice skill input flow — Mic recording, transcript display, skill extraction confirmation
- [ ] OTP confirmation page — Enter customer OTP to complete job
- [ ] Earnings page — Transaction history, pending payouts

### 4.5 Employer Pages
- [ ] Employer dashboard — Active Jobs, Total Applicants, Hired This Month, Active Postings table, Recent Applicants sidebar
- [ ] Post a Job wizard — Step 1 (Details) → Step 2 (Requirements) → Step 3 (Review & Publish)
- [ ] My Jobs listing — Edit, pause, close actions
- [ ] Applicant review page — AI-ranked list with match %, worker profile preview
- [ ] Worker directory — Search/filter workers, send direct offers
- [ ] Company profile editor
- [ ] Analytics page — Jobs posted, fill rate, time-to-hire charts

### 4.6 Customer Pages
- [ ] Customer dashboard — Active bookings, past services
- [ ] Service request — Category grid (AC Repair, Plumbing, Painting, etc.)
- [ ] Worker search results — Filter by rating, distance, price; sort options
- [ ] Worker profile view — Skills, ratings, reviews, book button
- [ ] Booking confirmation — Date/time, payment method selection
- [ ] Active booking view — Worker contact, OTP share button
- [ ] Rate & review — Star rating + text review
- [ ] Booking history — Past and upcoming

### 4.7 Admin Panel
- [ ] Admin dashboard — MAU, GMV, fill rate KPI cards
- [ ] User management — Filterable table, activate/suspend/ban actions
- [ ] Dispute resolution — Case view with booking details, OTP log, resolution actions
- [ ] Analytics — Charts (Recharts): skill demand, city distribution, revenue
- [ ] Commission config — Per-category fee percentage editor
- [ ] Export reports — CSV download

### 4.8 i18n (Internationalization)
- [ ] Set up next-i18next with `en` and `hi` locales
- [ ] Create English translation file
- [ ] Create Hindi translation file
- [ ] Language toggle component in navigation

### 4.9 SEO & Performance
- [ ] Add meta tags, Open Graph, structured data for landing/public pages
- [ ] Implement `<title>` and `<meta description>` per page
- [ ] Configure Next.js Image optimization
- [ ] Ensure WCAG 2.1 AA accessibility (ARIA labels, focus management)

---

## Phase 5: Integration & Testing

### 5.1 Integration
- [ ] Connect frontend to backend API — all endpoints wired
- [ ] Connect backend to AI service — recommendation, skill extraction proxies
- [ ] Configure BullMQ event pipeline end-to-end
- [ ] Test full user journeys:
  - [ ] Worker: register → create profile → discover jobs → apply → get hired → OTP confirm → get paid
  - [ ] Employer: register → post job → review applicants → hire worker
  - [ ] Customer: register → request service → browse workers → book → OTP → rate

### 5.2 Testing
- [ ] API unit tests: auth, workers, jobs, employers, customers, payments, ratings
- [ ] AI service pytest: recommendations, skill extraction, salary prediction
- [ ] Frontend component tests: Vitest
- [ ] E2E tests: Playwright for critical flows
- [ ] Security audit: check all OWASP Top 10 items

### 5.3 Documentation
- [ ] Complete API documentation (Swagger auto-generated)
- [ ] README with full setup guide
- [ ] Environment variables reference
- [ ] Architecture diagram

---

## Summary

| Phase | Items | Priority |
|-------|-------|----------|
| Phase 1: Foundation | 12 tasks | 🔴 Critical |
| Phase 2: Backend API | 65+ tasks | 🔴 Critical |
| Phase 3: AI/ML Service | 25+ tasks | 🔴 Critical |
| Phase 4: Web Frontend | 50+ tasks | 🟡 High |
| Phase 5: Integration | 15+ tasks | 🟡 High |
| **Total** | **~170 tasks** | |
