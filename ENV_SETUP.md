# 🔑 Environment Variable Setup

## Overview

Hunar uses environment variables for all secrets, API keys, and configuration. **Never commit secrets to Git.**

---

## 📄 Master `.env` File

The root `.env` file is shared across API and AI services via `dotenv`. Copy `.env.example` and fill in values:

```bash
cp .env.example .env
```

---

## Variable Reference

### 🗄️ Database

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | `postgresql://hunar:hunar_secret@localhost:5432/hunar_db?schema=public` | PostgreSQL connection string |
| `REDIS_URL` | ✅ | `redis://localhost:6379` | Redis connection string |

### 🔐 Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_ACCESS_SECRET` | ✅ | — | Min 32 chars, used to sign access JWTs |
| `JWT_REFRESH_SECRET` | ✅ | — | Min 32 chars, used to sign refresh JWTs |
| `JWT_ACCESS_EXPIRY` | ❌ | `24h` | Access token TTL |
| `JWT_REFRESH_EXPIRY` | ❌ | `30d` | Refresh token TTL |

**Generate secrets:**
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
[System.Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

### 📱 OTP Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OTP_EXPIRY_MINUTES` | ❌ | `10` | OTP validity period |
| `OTP_MAX_ATTEMPTS` | ❌ | `3` | Max wrong OTP attempts |
| `OTP_RATE_LIMIT_PER_HOUR` | ❌ | `5` | Max OTP requests per hour |

### 📲 SMS Provider

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMS_PROVIDER` | ❌ | `console` | `console` (dev), `msg91`, or `twilio` |
| `MSG91_AUTH_KEY` | ⚠️ | — | Required if SMS_PROVIDER=msg91 |
| `MSG91_SENDER_ID` | ⚠️ | `HUNAR` | SMS sender name |
| `TWILIO_ACCOUNT_SID` | ⚠️ | — | Required if SMS_PROVIDER=twilio |
| `TWILIO_AUTH_TOKEN` | ⚠️ | — | Required if SMS_PROVIDER=twilio |
| `TWILIO_PHONE_NUMBER` | ⚠️ | — | Required if SMS_PROVIDER=twilio |

> **Dev Mode:** Set `SMS_PROVIDER=console` to print OTPs to terminal instead of sending SMS.

### 🤖 AI Service

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI_SERVICE_URL` | ❌ | `http://localhost:8000` | AI microservice URL |
| `AI_SERVICE_API_KEY` | ❌ | `internal-ai-service-key` | Internal auth key |

### 💰 Razorpay Payments

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RAZORPAY_KEY_ID` | ⚠️ | — | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | ⚠️ | — | Razorpay API key secret |
| `RAZORPAY_WEBHOOK_SECRET` | ⚠️ | — | Webhook signature verification |
| `PLATFORM_COMMISSION_RATE` | ❌ | `0.10` | Platform commission (10%) |

> **Dev Mode:** Use `rzp_test_*` keys from Razorpay Dashboard → Test Mode.

### 🔥 Firebase (Push Notifications)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FIREBASE_PROJECT_ID` | ⚠️ | — | Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | ⚠️ | — | Firebase service account key |
| `FIREBASE_CLIENT_EMAIL` | ⚠️ | — | Firebase service account email |

### 🗺️ Google Maps

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_MAPS_API_KEY` | ⚠️ | — | For geocoding and distance |

### ☁️ AWS S3 (File Storage)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AWS_REGION` | ⚠️ | `ap-south-1` | AWS region |
| `AWS_ACCESS_KEY_ID` | ⚠️ | — | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | ⚠️ | — | IAM secret key |
| `S3_BUCKET_NAME` | ⚠️ | `hunar-uploads` | S3 bucket name |
| `CLOUDFRONT_URL` | ❌ | — | CDN URL for served files |

### 🌐 Application

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | ❌ | `development` | `development` or `production` |
| `PORT` | ❌ | `3001` | API server port |
| `WEB_URL` | ❌ | `http://localhost:3000` | Frontend URL |
| `API_URL` | ❌ | `http://localhost:3001` | API URL |
| `CORS_ORIGINS` | ✅ | `http://localhost:3000` | Comma-separated allowed origins |

### 🛡️ Rate Limiting

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RATE_LIMIT_AUTH` | ❌ | `100` | Max requests/min (authenticated) |
| `RATE_LIMIT_UNAUTH` | ❌ | `20` | Max requests/min (unauthenticated) |

---

## 🌐 Web Frontend Environment

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.hunar.app/api/v1
```

---

## 📱 Mobile App Environment

The mobile app hardcodes the base URL in `api_endpoints.dart`. For production, change:

```dart
// Development (Android emulator)
static const String baseUrl = 'http://10.0.2.2:3001/api/v1';

// Production
static const String baseUrl = 'https://api.hunar.app/api/v1';
```

> **Tip:** Use `--dart-define` to inject at build time:
> ```bash
> flutter run --dart-define=API_BASE_URL=https://api.hunar.app/api/v1
> ```

---

## 🐳 Docker Environment

Docker Compose uses the root `.env` automatically. Additional Docker-specific variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_PORT` | `5432` | Exposed PostgreSQL port |
| `DB_USER` | `hunar` | Database username |
| `DB_PASSWORD` | `hunar_secret` | Database password |
| `DB_NAME` | `hunar_db` | Database name |
| `REDIS_PORT` | `6379` | Exposed Redis port |
| `REDIS_PASSWORD` | (none) | Redis password |
| `API_PORT` | `3001` | Exposed API port |
| `AI_PORT` | `8000` | Exposed AI service port |
| `WEB_PORT` | `3000` | Exposed web port |
| `NGINX_PORT` | `80` | Exposed HTTP port |
| `NGINX_SSL_PORT` | `443` | Exposed HTTPS port |

---

## ⚡ Quick Setup (Minimal for Local Dev)

Only these are needed to run locally:

```env
DATABASE_URL=postgresql://hunar:hunar_secret@localhost:5432/hunar_db?schema=public
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=dev-access-secret-change-in-production-min32chars
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production-min32char
SMS_PROVIDER=console
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

Everything else has sensible defaults for development.
