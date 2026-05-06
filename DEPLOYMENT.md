# Deployment Guide

## 📋 Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Mobile App Stores](#mobile-app-stores)
5. [Environment Variables](#environment-variables)
6. [Database Migrations](#database-migrations)
7. [Monitoring](#monitoring)

---

## Local Development

### All Services (Docker)

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** on port 5432
- **Redis** on port 6379
- **Fastify API** on port 3001
- **FastAPI AI** on port 8000
- **Next.js Web** on port 3000

### Individual Services

```bash
# API Server
cd apps/api
npm install
npm run dev                    # http://localhost:3001

# AI Service
cd services/ai
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Web App
cd apps/web
npm install
npm run dev                    # http://localhost:3000

# Mobile App
cd apps/mobile
flutter pub get
flutter run                    # Android/iOS emulator
```

---

## Docker Deployment

### Production Build

```bash
# Build all images
docker-compose -f docker-compose.prod.yml build

# Start production stack
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Docker Images

| Service | Dockerfile | Port |
|---------|-----------|------|
| API | `apps/api/Dockerfile` | 3001 |
| AI Service | `services/ai/Dockerfile` | 8000 |
| Web | `apps/web/Dockerfile` | 3000 |
| PostgreSQL | Official image | 5432 |
| Redis | Official image | 6379 |

---

## Cloud Deployment

### AWS (Recommended)

```bash
# 1. ECR — Push Docker images
aws ecr create-repository --repository-name hunar-api
docker tag hunar-api:latest <account>.dkr.ecr.<region>.amazonaws.com/hunar-api:latest
docker push <account>.dkr.ecr.<region>.amazonaws.com/hunar-api:latest

# 2. ECS — Deploy containers
# Use the provided task definitions in infra/aws/

# 3. RDS — PostgreSQL
# Create RDS PostgreSQL instance (db.t3.medium minimum)

# 4. ElastiCache — Redis
# Create ElastiCache Redis cluster

# 5. S3 — File storage
# Create S3 bucket for user uploads

# 6. CloudFront — CDN for web app
# Create distribution pointing to ECS service
```

### GCP

```bash
# Cloud Run deployment
gcloud run deploy hunar-api \
  --image gcr.io/PROJECT_ID/hunar-api \
  --port 3001 \
  --set-env-vars "DATABASE_URL=..." \
  --allow-unauthenticated

# Cloud SQL for PostgreSQL
# Memorystore for Redis
```

### Railway / Render (Quick Deploy)

Both platforms support Docker-based deployment:
1. Connect your GitHub repository
2. Set environment variables
3. Deploy each service as a separate service

---

## Mobile App Stores

### Android (Google Play)

```bash
# 1. Generate release keystore
keytool -genkey -v -keystore ~/hunar-release.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias hunar

# 2. Configure signing in android/app/build.gradle
# Add signingConfigs and buildTypes blocks

# 3. Build App Bundle
cd apps/mobile
flutter build appbundle --release

# Output: build/app/outputs/bundle/release/app-release.aab
# Upload to Google Play Console
```

### iOS (App Store)

```bash
# 1. Configure in Xcode
# Open ios/Runner.xcworkspace
# Set Bundle Identifier, Team, Signing

# 2. Build archive
cd apps/mobile
flutter build ios --release

# 3. Archive in Xcode → Upload to App Store Connect
```

---

## Environment Variables

### API Server (`apps/api/.env`)

```env
# Server
PORT=3001
NODE_ENV=production
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:pass@host:5432/hunar
REDIS_URL=redis://host:6379

# Auth
JWT_SECRET=your-jwt-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# SMS Gateway (for OTP)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=HUNAR

# AI Service
AI_SERVICE_URL=http://ai-service:8000

# Storage
S3_BUCKET=hunar-uploads
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=ap-south-1
```

### AI Service (`services/ai/.env`)

```env
# Server
PORT=8000
ENVIRONMENT=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/hunar

# AI Model
MODEL_PATH=./models/skill_extraction_v2
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### Mobile App (`apps/mobile/.env`)

```env
API_BASE_URL=https://api.hunar.app
AI_SERVICE_URL=https://ai.hunar.app
RAZORPAY_KEY=rzp_live_xxxxx
GOOGLE_MAPS_KEY=AIzaSy_xxxxx
```

---

## Database Migrations

```bash
# Run migrations
cd apps/api
npx prisma migrate deploy

# Generate client
npx prisma generate

# Reset database (DANGER — drops all data)
npx prisma migrate reset
```

---

## Monitoring

### Health Checks

```bash
# API health
curl https://api.hunar.app/health

# AI service health
curl https://ai.hunar.app/health
```

### Recommended Monitoring Stack

| Tool | Purpose |
|------|---------|
| **Datadog / New Relic** | APM, error tracking |
| **Sentry** | Error monitoring (mobile + API) |
| **Grafana + Prometheus** | Infrastructure metrics |
| **PgHero** | PostgreSQL performance |
| **Firebase Crashlytics** | Mobile crash reports |

### Logging

All services output structured JSON logs:
```json
{
  "level": "info",
  "timestamp": "2026-01-15T10:30:00Z",
  "service": "api",
  "message": "Request completed",
  "method": "POST",
  "path": "/auth/verify-otp",
  "statusCode": 200,
  "duration": 45
}
```

---

## SSL/TLS Setup

### Using Certbot (Let's Encrypt)

```bash
certbot certonly --standalone -d api.hunar.app -d ai.hunar.app -d app.hunar.app
```

### Using Cloudflare

1. Add domain to Cloudflare
2. Enable "Full (Strict)" SSL mode
3. DNS records:
   - `api.hunar.app` → API server IP
   - `ai.hunar.app` → AI service IP
   - `app.hunar.app` → Web app IP

---

## Scaling Recommendations

| Users | API Instances | DB | Redis | AI Workers |
|-------|--------------|-----|-------|-----------|
| < 1K | 1 (t3.small) | t3.medium | t3.micro | 1 |
| 1K-10K | 2 (t3.medium) | r5.large | r5.large | 2 |
| 10K-100K | 4 (c5.xlarge) | r5.2xlarge | r5.xlarge | 4 |
| > 100K | Auto-scale | Aurora | Cluster | GPU fleet |
