# 🎯 Hunar — AI-Powered Blue-Collar Job Platform

<p align="center">
  <img src="https://img.shields.io/badge/Flutter-3.7+-02569B?logo=flutter" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js" />
  <img src="https://img.shields.io/badge/Fastify-4.0-000000?logo=fastify" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
</p>

> **Connecting skilled workers with employers through AI-powered matching in India's blue-collar economy.**

Hunar is a full-stack platform bridging the gap between skilled blue-collar workers and employers/customers. Features include AI-powered skill extraction from voice input, intelligent job-worker matching, automated applicant ranking, and secure escrow-based payments.

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| **[README_PRODUCTION.md](./README_PRODUCTION.md)** | Production-ready overview with quick start |
| **[PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md)** | System architecture, flows, diagrams |
| **[API_COMMUNICATION.md](./API_COMMUNICATION.md)** | 50+ endpoints, JWT flow, request examples |
| **[ENV_SETUP.md](./ENV_SETUP.md)** | All environment variables explained |
| **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** | Free deployment (Vercel + Render + Supabase) |
| **[PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)** | Pre-launch checks, known issues, monitoring |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Docker/cloud/store deployment |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Code conventions, PR workflow |
| **[SECURITY.md](./SECURITY.md)** | Security policy |
| **[CHANGELOG.md](./CHANGELOG.md)** | Version history |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 20.0 |
| Flutter | ≥ 3.7.0 |
| Python | ≥ 3.10 |
| Docker | Latest |

### Start Everything

```bash
git clone https://github.com/your-org/hunar.git && cd hunar
cp .env.example .env

# Start DB + Redis
docker compose -f infra/docker-compose.yml up -d

# Start API
cd apps/api && npm install && npx prisma generate && npx prisma migrate dev && npm run dev

# Start AI (new terminal)
cd apps/ai-service && pip install -r requirements.txt && python -m app.main

# Start Web (new terminal)
cd apps/web && npm install && npm run dev

# Start Mobile (new terminal)
cd apps/mobile && flutter pub get && flutter run
```

**Services:**
- 🌐 Web → http://localhost:3000
- ⚡ API → http://localhost:3001
- 📚 API Docs → http://localhost:3001/docs
- 🤖 AI → http://localhost:8000/docs
- 📱 Mobile → Android/iOS emulator

---

## 📦 Monorepo Structure

```
hunar/
├── apps/
│   ├── api/          # Fastify REST API (TypeScript, Prisma)
│   ├── web/          # Next.js 16 Web App (Tailwind, React Query)
│   ├── ai-service/   # FastAPI AI Service (scikit-learn, spaCy, XGBoost)
│   └── mobile/       # Flutter Mobile App (Riverpod, GoRouter, Dio)
├── packages/shared/  # Shared TypeScript types
├── infra/            # Docker, Nginx configs
├── .github/workflows/# CI/CD pipeline
└── project-docs/     # Design documents
```

---

## 🏗️ Architecture

```
┌─────────────┐    ┌──────────────┐
│ Flutter App  │    │ Next.js Web  │
└──────┬───────┘    └──────┬───────┘
       │ Dio + JWT         │ Axios + JWT
       └───────────────────┤
                    ┌──────▼──────┐
                    │  Fastify    │ ← Helmet + CORS + Rate Limit
                    │  REST API   │
                    └──┬─────┬───┘
              ┌────────▼┐ ┌──▼──────────┐
              │PostgreSQL│ │ FastAPI AI  │
              │ + pgvec  │ │ NLP + ML    │
              └──────────┘ └─────────────┘
                    ┌─────────────┐
                    │  Redis 7    │
                    └─────────────┘
```

---

## 📱 Features by Role

### 🔧 Workers
- AI job recommendations with match scores
- Voice skill extraction (Hindi/English)
- Earnings dashboard & application tracker

### 🏢 Employers
- AI applicant ranking
- 3-step job posting with salary prediction
- Hiring analytics & worker directory

### 🏠 Customers
- UrbanClap-style service marketplace
- 3-step booking with escrow payment
- OTP job completion & worker ratings

---

## 🚢 Deploy Free

| Layer | Platform | Cost |
|-------|----------|------|
| Web | Vercel | $0 |
| API | Render | $0 |
| AI | Render | $0 |
| DB | Supabase | $0 |
| Redis | Upstash | $0 |
| APK | GitHub Releases | $0 |

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for step-by-step instructions.

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

<p align="center">Made with ❤️ for India's 450 million blue-collar workforce</p>
