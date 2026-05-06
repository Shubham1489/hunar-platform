# 🎯 Hunar — Production-Ready Platform

> **AI-Powered Blue-Collar Job Platform** connecting workers, employers, and customers.

[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)](https://github.com)
[![Flutter](https://img.shields.io/badge/Mobile-Flutter%203.7+-02569B?logo=flutter)](https://flutter.dev)
[![Next.js](https://img.shields.io/badge/Web-Next.js%2016-000?logo=next.js)](https://nextjs.org)
[![Fastify](https://img.shields.io/badge/API-Fastify%204-000?logo=fastify)](https://fastify.dev)
[![FastAPI](https://img.shields.io/badge/AI-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

---

## 🚀 Quick Start (Run Locally in 5 Minutes)

### Option A: Docker (Recommended)

```bash
# 1. Clone
git clone https://github.com/your-org/hunar.git
cd hunar

# 2. Setup environment
cp .env.example .env

# 3. Start all services
docker compose -f infra/docker-compose.yml up -d    # DB + Redis
npm run dev                                          # API + Web

# 4. Run mobile app
cd apps/mobile && flutter pub get && flutter run
```

### Option B: Manual Setup

```bash
# 1. Database & Cache
docker compose -f infra/docker-compose.yml up -d

# 2. API Server
cd apps/api
npm install
npx prisma generate
npx prisma migrate dev
npm run dev              # → http://localhost:3001
                        # → Swagger at http://localhost:3001/docs

# 3. AI Service
cd apps/ai-service
pip install -r requirements.txt
python -m app.main       # → http://localhost:8000/docs

# 4. Web App
cd apps/web
npm install
npm run dev              # → http://localhost:3000

# 5. Mobile App
cd apps/mobile
flutter pub get
flutter run              # → Android/iOS emulator
```

---

## 📖 Documentation Index

| Document | Description |
|----------|-------------|
| [PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md) | System architecture, tech stack, data flow diagrams |
| [API_COMMUNICATION.md](./API_COMMUNICATION.md) | 50+ API endpoints, JWT flow, CORS, request/response examples |
| [ENV_SETUP.md](./ENV_SETUP.md) | All environment variables with descriptions and defaults |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Free hosting deployment (Vercel + Render + Supabase) |
| [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) | Pre-deployment checks, known issues, monitoring |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Code conventions, branch naming, PR workflow |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Docker/cloud deployment, mobile store submission |
| [SECURITY.md](./SECURITY.md) | Security policy and vulnerability reporting |
| [CHANGELOG.md](./CHANGELOG.md) | Version history |
| [apps/mobile/README.md](./apps/mobile/README.md) | Mobile app guide, features, AI integrations |
| [apps/api/README.md](./apps/api/README.md) | API documentation and setup |
| [apps/web/README.md](./apps/web/README.md) | Web app documentation |
| [apps/ai-service/README.md](./apps/ai-service/README.md) | AI service documentation |

---

## 🏗️ System Architecture

```
┌─────────────┐    ┌──────────────┐    ┌──────────────┐
│ Flutter App  │    │ Next.js Web  │    │ Admin Panel  │
│   (Mobile)   │    │  (Browser)   │    │  (Browser)   │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       │ Dio + JWT         │ Axios + JWT       │
       └───────────────────┼───────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Fastify    │
                    │  REST API   │ ← Rate Limit + Helmet + CORS
                    │  Port 3001  │
                    └──┬─────┬───┘
                       │     │
              ┌────────▼┐ ┌──▼──────────┐
              │PostgreSQL│ │ FastAPI AI  │
              │ + Vector │ │ Port 8000   │
              │Port 5432 │ │ NLP + ML    │
              └──────────┘ └─────────────┘
                    ┌─────────────┐
                    │  Redis 7    │
                    │ Port 6379   │
                    └─────────────┘
```

---

## 📱 Features

### For Workers 🔧
- Voice-to-skill extraction (Hindi/English)
- AI job recommendations with match scores
- Application tracker with status updates
- Earnings dashboard with charts
- Aadhaar verification badge

### For Employers 🏢
- AI applicant ranking by skill match
- 3-step job posting with salary prediction
- Hiring funnel analytics
- Worker directory with direct offers
- Multi-role access management

### For Customers 🏠
- UrbanClap-style service marketplace
- Worker search with ratings & reviews
- 3-step booking with escrow payment
- OTP-verified job completion
- Dispute resolution system

---

## 🧪 Testing

```bash
# Mobile
cd apps/mobile && flutter test

# API (TypeScript)
cd apps/api && npm test

# AI Service (Python)
cd apps/ai-service && python -m pytest

# Full analysis
cd apps/mobile && flutter analyze    # Should report: 0 issues
```

---

## 🚢 Deploy to Production (Free)

```bash
# 1. Database → Supabase (free)
# 2. Backend  → Render (free)
# 3. AI       → Render (free)
# 4. Frontend → Vercel (free)
# 5. Mobile   → GitHub Releases (free)

# See DEPLOYMENT_GUIDE.md for step-by-step instructions
```

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  <b>Made with ❤️ for India's 450 million blue-collar workforce</b>
</p>
