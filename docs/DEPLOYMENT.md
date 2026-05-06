# Hunar — Deployment Guide

Complete guide for deploying the Hunar platform to production.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Option 1: Docker Compose (Single Server)](#option-1-docker-compose-single-server)
- [Option 2: Cloud Deployment (Recommended)](#option-2-cloud-deployment-recommended)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [SSL/HTTPS Setup](#sslhttps-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)
- [Scaling](#scaling)
- [Backup & Recovery](#backup--recovery)
- [Production Checklist](#production-checklist)

---

## Overview

Hunar consists of 3 deployable services:

| Service | Runtime | Port | Recommended Host |
|---------|---------|------|-----------------|
| **Web Frontend** | Node.js (Next.js) | 3000 | Vercel / Netlify |
| **Backend API** | Node.js (Fastify) | 3001 | AWS EC2 / Railway / GCP Cloud Run |
| **AI Service** | Python (FastAPI) | 8000 | GCP Cloud Run / AWS Lambda |

Plus 2 infrastructure services:

| Service | Version | Port | Recommended Host |
|---------|---------|------|-----------------|
| **PostgreSQL** | 15 + pgvector | 5432 | Supabase / Neon / AWS RDS |
| **Redis** | 7 | 6379 | Upstash / Redis Cloud |

---

## Prerequisites

- Domain name (e.g., `hunar.app`)
- SSL certificate (via Let's Encrypt or Cloudflare)
- Docker installed on the server
- Production `.env` file with real secrets

---

## Option 1: Docker Compose (Single Server)

Best for: Small deployments, staging environments, VPS hosting.

### 1. Prepare the Server

```bash
# Example: Ubuntu 22.04 on AWS EC2 / DigitalOcean
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 git nginx certbot

# Enable Docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### 2. Clone and Configure

```bash
git clone https://github.com/your-username/hunar.git /opt/hunar
cd /opt/hunar
cp .env.example .env
nano .env  # Edit with production values
```

### 3. Create Production Docker Compose

Create `infra/docker-compose.prod.yml`:

```yaml
version: '3.9'

services:
  postgres:
    image: pgvector/pgvector:pg15
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: hunar_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U hunar']
      interval: 30s
      timeout: 10s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    volumes:
      - redis_data:/data

  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    restart: always
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/hunar_db
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  ai-service:
    build:
      context: ./apps/ai-service
      dockerfile: Dockerfile
    restart: always
    ports:
      - '8000:8000'

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    restart: always
    ports:
      - '3000:3000'
    environment:
      - NEXT_PUBLIC_API_URL=https://api.hunar.app

volumes:
  postgres_data:
  redis_data:
```

### 4. Create Dockerfiles

**`apps/api/Dockerfile`**:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

**`apps/ai-service/Dockerfile`**:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**`apps/web/Dockerfile`**:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### 5. Deploy

```bash
cd /opt/hunar

# Build and start all services
docker compose -f infra/docker-compose.prod.yml up -d --build

# Run database migrations
docker compose -f infra/docker-compose.prod.yml exec api npx prisma migrate deploy

# Seed the database (first time only)
docker compose -f infra/docker-compose.prod.yml exec api npx ts-node prisma/seed.ts
```

### 6. Configure Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/hunar
server {
    listen 80;
    server_name hunar.app www.hunar.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name hunar.app www.hunar.app;

    ssl_certificate /etc/letsencrypt/live/hunar.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hunar.app/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Option 2: Cloud Deployment (Recommended)

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from web directory
cd apps/web
vercel --prod

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://api.hunar.app
```

### Backend API → Railway / Render

```bash
# Railway
npm i -g @railway/cli
railway login
cd apps/api
railway init
railway up

# Set environment variables in Railway dashboard
```

### AI Service → GCP Cloud Run

```bash
# Build and push Docker image
gcloud builds submit --tag gcr.io/hunar-project/ai-service ./apps/ai-service

# Deploy to Cloud Run
gcloud run deploy hunar-ai \
  --image gcr.io/hunar-project/ai-service \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8000 \
  --memory 1Gi
```

### Database → Supabase / Neon

1. Create a PostgreSQL 15 instance on [Supabase](https://supabase.com) or [Neon](https://neon.tech)
2. Enable the `vector` extension: `CREATE EXTENSION vector;`
3. Update `DATABASE_URL` in your API service's environment
4. Run migrations: `npx prisma migrate deploy`

### Redis → Upstash

1. Create a Redis instance on [Upstash](https://upstash.com)
2. Copy the connection URL
3. Update `REDIS_URL` in your API service's environment

---

## Environment Configuration

### Production `.env` (Critical Variables)

```bash
NODE_ENV=production
PORT=3001

# Strong random secrets (generate with: openssl rand -base64 32)
JWT_ACCESS_SECRET=<random-64-char-string>
JWT_REFRESH_SECRET=<different-random-64-char-string>

# Production database
DATABASE_URL=postgresql://user:pass@host:5432/hunar_db?sslmode=require

# Production Redis
REDIS_URL=redis://:password@host:6379

# Real SMS provider
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your-msg91-key

# Razorpay live keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx

# CORS — only allow your domain
CORS_ORIGINS=https://hunar.app,https://www.hunar.app

# API URLs
API_URL=https://api.hunar.app
WEB_URL=https://hunar.app
AI_SERVICE_URL=https://ai.hunar.app
```

---

## Database Setup

### Initial Migration

```bash
# Generate and apply migrations
npx prisma migrate deploy

# Seed with initial data
npx ts-node prisma/seed.ts
```

### Production Migration Workflow

```bash
# 1. Make schema changes in schema.prisma
# 2. Create migration locally
npx prisma migrate dev --name add_new_feature

# 3. Review the generated SQL in prisma/migrations/
# 4. Commit the migration file
# 5. Deploy to production
npx prisma migrate deploy
```

---

## Monitoring & Logging

### Recommended Stack

| Tool | Purpose | Cost |
|------|---------|------|
| **Sentry** | Error tracking | Free tier available |
| **Datadog / Grafana** | Metrics & dashboards | Varies |
| **Loki / CloudWatch** | Log aggregation | Varies |
| **Uptime Robot** | Uptime monitoring | Free tier |
| **Better Stack** | All-in-one | Free tier |

### Health Check Endpoints

```bash
# API health
curl https://api.hunar.app/health

# AI service health
curl https://ai.hunar.app/health

# Database check
curl https://api.hunar.app/health/db
```

---

## Scaling

### Horizontal Scaling

| Component | Strategy |
|-----------|----------|
| **API** | Run multiple instances behind a load balancer |
| **AI Service** | Scale independently based on ML workload |
| **Frontend** | CDN edge caching (Vercel handles this) |
| **Database** | Read replicas for read-heavy queries |
| **Redis** | Redis Cluster for high availability |

### Performance Targets

| Metric | Target |
|--------|--------|
| API response time (P95) | < 200ms |
| AI recommendation | < 2s |
| Page load (LCP) | < 2.5s |
| Database queries | < 50ms |
| Uptime | 99.9% |

---

## Backup & Recovery

### Database Backups

```bash
# Automated daily backup
pg_dump -U hunar hunar_db | gzip > /backups/hunar_$(date +%Y%m%d).sql.gz

# Restore from backup
gunzip -c /backups/hunar_20260409.sql.gz | psql -U hunar hunar_db
```

### Redis Backup

Redis is configured with append-only file (AOF) persistence. The data is non-critical (caches, sessions) and can be rebuilt.

---

## Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Set strong JWT secrets (64+ characters)
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS to allow only your domains
- [ ] Enable rate limiting (`RATE_LIMIT_AUTH=100`)
- [ ] Set up firewall rules (only expose ports 80, 443)
- [ ] Disable `NODE_ENV=development` features

### Database
- [ ] Migrate schema: `npx prisma migrate deploy`
- [ ] Seed initial data: skill taxonomy, admin user
- [ ] Enable SSL connection (`?sslmode=require`)
- [ ] Set up automated backups (daily)
- [ ] Enable connection pooling

### Services
- [ ] Configure real SMS provider (MSG91/Twilio)
- [ ] Set Razorpay live keys + webhook URL
- [ ] Configure S3 bucket for file uploads
- [ ] Set up Firebase/FCM for push notifications
- [ ] Point `AI_SERVICE_URL` to production AI service

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation
- [ ] Create performance dashboards
- [ ] Configure alerting (PagerDuty/Slack)

### DNS
- [ ] Point `hunar.app` → frontend
- [ ] Point `api.hunar.app` → backend API
- [ ] Point `ai.hunar.app` → AI service
- [ ] Enable Cloudflare proxy for DDoS protection

---

<p align="center">
  <sub>For questions about deployment, open an issue or reach out to the team.</sub>
</p>
