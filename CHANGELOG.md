# Changelog

All notable changes to the Hunar platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-04-09

### 🎉 Initial Release

The complete foundation of the Hunar AI-Powered Blue-Collar Job Platform.

### Added

#### Infrastructure
- Turborepo monorepo with npm workspaces
- Docker Compose configuration (PostgreSQL 15 + pgvector, Redis 7)
- Shared TypeScript package (`@hunar/shared`) with types, enums, Zod schemas
- Environment configuration with `.env.example`

#### Backend API (`apps/api`)
- Fastify 5 server with TypeScript
- Prisma ORM with 15 database models
- **Auth Module** — OTP-based login, JWT RS256 with refresh rotation, Redis token blacklist
- **Workers Module** — Profile CRUD, skill management, AI recommendation proxy
- **Jobs Module** — Job search, posting, apply with AI-ranked applicants
- **Employers Module** — Employer profiles, job management, worker directory, analytics
- **Customers Module** — Service requests, worker search, bookings, OTP completion, ratings
- **Payments Module** — Razorpay integration, escrow payments, webhook handling
- **Ratings Module** — Review submission, reporting
- **Notifications Module** — Notification inbox, batch read
- **Admin Module** — User management, dispute resolution, CSV export, platform analytics
- **AI Proxy Module** — Proxy to Python AI service for recommendations, skills, salary, ranking
- Middleware: JWT authentication, RBAC authorization, global error handler
- Database seed script with 27 skills, 4 demo users, sample jobs and bookings

#### AI/ML Service (`apps/ai-service`)
- FastAPI server with 4 AI routers
- **Recommendation Engine** — TF-IDF + cosine similarity + haversine distance scoring
- **Skill Extraction** — NLP pipeline with language detection, translation, fuzzy matching
- **Salary Prediction** — Rule-based estimator with city tiers (XGBoost-ready)
- **Applicant Ranking** — Skill match + experience + rating-based ranking
- 27-skill taxonomy with Hindi aliases

#### Frontend (`apps/web`)
- Next.js 16 with React 19, Tailwind CSS 4
- **Design System** — Brand tokens, no-line rule, glassmorphism, gradient effects
- **Landing Page** — Hero section, service categories, how-it-works, AI features, testimonials
- **Login Page** — Role selection with phone input
- **OTP Verification** — 6-digit input with auto-advance and paste support
- **Worker Dashboard** — Earnings stats, AI job recommendations, applications tracker
- **Employer Dashboard** — Active job postings, AI-ranked applicants, analytics
- **Customer Dashboard** — UrbanClap-style service grid, active bookings, nearby workers
- Zustand auth store with JWT management
- Axios API client with interceptors and auto-refresh

#### Documentation
- Comprehensive README with architecture, setup, API reference
- MIT License
- Contributing guide with commit conventions and code style
- Changelog
- API documentation
- Code architecture documentation

---

## [Unreleased]

### Planned
- Worker profile edit page
- Job search/browse page with filters
- Employer post-job form
- Customer booking flow
- Voice skill input (Web Speech API integration)
- Real-time notifications (WebSocket/SSE)
- File upload (avatar, resumes, documents)
- Integration tests (end-to-end flows)
- Docker multi-stage production builds
- CI/CD pipeline (GitHub Actions)
- Flutter mobile app
