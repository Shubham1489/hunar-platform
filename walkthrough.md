# Hunar AI Platform — Build Walkthrough

## What Was Built

A full-stack, production-ready **AI-powered blue-collar job platform** with 3 applications across a Turborepo monorepo.

---

## Architecture Overview

```mermaid
graph TD
    subgraph Frontend["🌐 Next.js 16 Web App"]
        LP[Landing Page]
        LG[Login + OTP]
        WD[Worker Dashboard]
        ED[Employer Dashboard]
        CD[Customer Dashboard]
    end

    subgraph API["⚡ Fastify API"]
        AUTH[Auth Module]
        JOBS[Jobs Module]
        WORK[Workers Module]
        EMP[Employers Module]
        CUST[Customers Module]
        PAY[Payments Module]
        NOTIF[Notifications]
        ADMIN[Admin Module]
    end

    subgraph AI["🧠 FastAPI AI Service"]
        REC[Recommendation Engine]
        SKILLS[Skill Extraction]
        SAL[Salary Prediction]
        RANK[Applicant Ranking]
    end

    subgraph Infra["🏗️ Infrastructure"]
        PG[(PostgreSQL 15 + pgvector)]
        REDIS[(Redis 7)]
    end

    Frontend --> API
    API --> AI
    API --> PG
    API --> REDIS
```

---

## Phase 1: Infrastructure ✅

| Component | Details |
|-----------|---------|
| **Monorepo** | Turborepo + npm workspaces |
| **Database** | PostgreSQL 15 with pgvector |
| **Cache** | Redis 7 |
| **Schema** | 15 Prisma models with full relations |
| **Shared** | `@hunar/shared` — types, enums, Zod schemas |

---

## Phase 2: Backend API ✅

8 fully implemented API modules:

| Module | Endpoints | Key Features |
|--------|-----------|--------------|
| **Auth** | `/auth/*` | OTP (SHA-256), JWT RS256, refresh rotation |
| **Workers** | `/workers/*` | Profile CRUD, skill taxonomy, AI proxy |
| **Jobs** | `/jobs/*` | Search, apply, AI-ranked applicants |
| **Employers** | `/employers/*` | Job CRUD, worker directory, analytics |
| **Customers** | `/customers/*` | Service requests, bookings, OTP completion |
| **Payments** | `/payments/*` | Razorpay integration, escrow, webhooks |
| **Notifications** | `/notifications/*` | Push inbox, mark read |
| **Admin** | `/admin/*` | User mgmt, disputes, analytics, CSV export |

---

## Phase 3: AI/ML Service ✅

| Engine | Algorithm | Output |
|--------|-----------|--------|
| **Job Recommendations** | TF-IDF + Cosine Similarity + Haversine | Top-N jobs with match % |
| **Skill Extraction** | LangDetect → Translation → Fuzzy Match (80%) | Skills with confidence scores |
| **Salary Prediction** | XGBoost-ready (rule-based MVP) | `{min, median, max}` in INR |
| **Applicant Ranking** | Skill cosine + experience bonus + rating | Ranked applicant list |

---

## Phase 4: Frontend ✅

### Landing Page
````carousel
![Hero section with glassmorphic search, voice input, gradient CTA](C:/Users/sswai/.gemini/antigravity/brain/345651b6-9d67-4e91-8e06-fa827dbf31e3/hero.png)
<!-- slide -->
![How it works and AI features sections](C:/Users/sswai/.gemini/antigravity/brain/345651b6-9d67-4e91-8e06-fa827dbf31e3/how_it_works.png)
````

### Login
![Role selection with Worker, Employer, Customer options](C:/Users/sswai/.gemini/antigravity/brain/345651b6-9d67-4e91-8e06-fa827dbf31e3/login.png)

### Worker Dashboard
![Worker dashboard with AI recommendations, earnings, applications](C:/Users/sswai/.gemini/antigravity/brain/345651b6-9d67-4e91-8e06-fa827dbf31e3/worker_dash.png)

### Employer Dashboard
![Employer dashboard with job postings, AI-ranked applicants](C:/Users/sswai/.gemini/antigravity/brain/345651b6-9d67-4e91-8e06-fa827dbf31e3/employer_dash.png)

### Customer Dashboard
![Customer dashboard with service grid, bookings, nearby workers](C:/Users/sswai/.gemini/antigravity/brain/345651b6-9d67-4e91-8e06-fa827dbf31e3/customer_dash.png)

---

## How to Run Locally

### 1. Start Infrastructure
```bash
docker compose -f infra/docker-compose.yml up -d
```

### 2. Setup Backend API
```bash
cd apps/api
cp ../../.env.example .env
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npm run dev
```

### 3. Start AI Service
```bash
cd apps/ai-service
pip install -r requirements.txt
python -m app.main
```

### 4. Start Frontend
```bash
cd apps/web
npm run dev
```

### Test Accounts
| Role | Phone | Name |
|------|-------|------|
| Admin | 9999999999 | Admin User |
| Worker | 9876543210 | Ramesh Kumar |
| Employer | 9876543211 | Priya Sharma |
| Customer | 9876543212 | Aisha Patel |

> [!TIP]
> In dev mode, any 6-digit OTP will work. The dev OTP is also displayed on the verification page.

---

## Remaining Work

| Item | Priority |
|------|----------|
| Job search/browse page | High |
| Employer post-job form | High |
| Customer booking flow | High |
| Voice skill input (Web Speech API) | Medium |
| Worker profile edit page | Medium |
| Real-time notifications (WebSocket) | Medium |
| File upload (avatar, docs) | Medium |
| Integration tests | Medium |
| Docker production builds | Low |
| CI/CD pipeline | Low |
