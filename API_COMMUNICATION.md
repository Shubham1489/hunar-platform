# 📡 API Communication Guide

## Overview

All communication in Hunar follows a **REST API** pattern with JWT authentication. There are three communication channels:

| Channel | Client | Server | Protocol |
|---------|--------|--------|----------|
| Web ↔ API | Next.js (Axios) | Fastify | HTTP/HTTPS |
| Mobile ↔ API | Flutter (Dio) | Fastify | HTTP/HTTPS |
| API ↔ AI | Fastify (httpx) | FastAPI | Internal HTTP |

---

## 🔗 API Base URLs

| Environment | Web Frontend | Mobile App | AI Service |
|-------------|-------------|------------|-----------|
| **Local Dev** | `http://localhost:3001/api/v1` | `http://10.0.2.2:3001/api/v1` | `http://localhost:8000` |
| **Docker** | `http://api:3001/api/v1` | N/A | `http://ai-service:8000` |
| **Production** | `https://api.hunar.app/api/v1` | `https://api.hunar.app/api/v1` | Internal only |

---

## 📋 Complete API Endpoint Map

### Auth Module (`/api/v1/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/request-otp` | ❌ | Send OTP to phone number |
| `POST` | `/auth/verify-otp` | ❌ | Verify OTP, get JWT tokens |
| `POST` | `/auth/refresh` | ❌ | Refresh access token |
| `POST` | `/auth/logout` | ✅ | Invalidate refresh token |
| `GET` | `/auth/me` | ✅ | Get current user profile |

### Worker Module (`/api/v1/workers`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/workers/me` | ✅ | WORKER | Get own profile |
| `PATCH` | `/workers/me` | ✅ | WORKER | Update profile |
| `GET` | `/workers/:id` | ✅ | ANY | Get worker public profile |
| `PATCH` | `/workers/me/availability` | ✅ | WORKER | Toggle availability |
| `GET` | `/workers/me/skills` | ✅ | WORKER | List skills |
| `POST` | `/workers/me/skills/voice` | ✅ | WORKER | AI voice skill extraction |
| `GET` | `/workers/me/applications` | ✅ | WORKER | List job applications |
| `GET` | `/workers/me/bookings` | ✅ | WORKER | List bookings |
| `GET` | `/workers/me/earnings` | ✅ | WORKER | Earnings summary |
| `POST` | `/workers/me/otp-confirm` | ✅ | WORKER | Confirm job completion OTP |
| `GET` | `/workers/me/recommendations` | ✅ | WORKER | AI job recommendations |

### Job Module (`/api/v1/jobs`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/jobs` | ✅ | List/search jobs (with filters) |
| `GET` | `/jobs/:id` | ✅ | Get job detail |
| `POST` | `/jobs/:id/apply` | ✅ WORKER | Apply to job |
| `GET` | `/jobs/:id/applicants` | ✅ EMPLOYER | List applicants |
| `PATCH` | `/jobs/:id/applicants/:workerId` | ✅ EMPLOYER | Update applicant status |

### Employer Module (`/api/v1/employers`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/employers/me` | ✅ | EMPLOYER | Get own profile |
| `PATCH` | `/employers/me` | ✅ | EMPLOYER | Update profile |
| `GET` | `/employers/me/jobs` | ✅ | EMPLOYER | List own job postings |
| `POST` | `/employers/jobs` | ✅ | EMPLOYER | Post new job |
| `PATCH` | `/employers/jobs/:id` | ✅ | EMPLOYER | Edit job posting |
| `GET` | `/employers/workers` | ✅ | EMPLOYER | Search worker directory |
| `POST` | `/employers/workers/:id/offer` | ✅ | EMPLOYER | Send direct offer |
| `GET` | `/employers/analytics` | ✅ | EMPLOYER | Hiring analytics |

### Customer Module (`/api/v1/customers`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/customers/me` | ✅ | CUSTOMER | Get own profile |
| `PATCH` | `/customers/me` | ✅ | CUSTOMER | Update profile |
| `POST` | `/customers/service-requests` | ✅ | CUSTOMER | Create service request |
| `GET` | `/customers/workers` | ✅ | CUSTOMER | Search nearby workers |
| `GET` | `/customers/bookings` | ✅ | CUSTOMER | List bookings |
| `GET` | `/customers/bookings/:id` | ✅ | CUSTOMER | Booking detail |
| `POST` | `/customers/bookings/:id/complete` | ✅ | CUSTOMER | Complete with OTP |
| `POST` | `/customers/bookings/:id/dispute` | ✅ | CUSTOMER | Raise dispute |
| `POST` | `/customers/bookings/:id/rate` | ✅ | CUSTOMER | Rate worker |

### Payment Module (`/api/v1/payments`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/payments/initiate` | ✅ | Create Razorpay order |
| `POST` | `/payments/verify` | ✅ | Verify payment signature |

### Rating Module (`/api/v1/ratings`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ratings` | ✅ | Create rating |
| `GET` | `/ratings/worker/:id` | ✅ | Get ratings for worker |

### AI Module (`/api/v1/ai`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/ai/recommendations` | ✅ | Get job recommendations |
| `POST` | `/ai/extract-skills` | ✅ | Extract skills from text/voice |
| `POST` | `/ai/predict-salary` | ✅ | Predict salary range |
| `POST` | `/ai/rank-applicants` | ✅ | Rank applicants by match |

### Notification Module (`/api/v1/notifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/notifications` | ✅ | List notifications |
| `PATCH` | `/notifications/:id/read` | ✅ | Mark as read |
| `PATCH` | `/notifications/read-all` | ✅ | Mark all as read |

### Utility Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Health check (DB + Redis status) |
| `GET` | `/docs` | ❌ | Swagger UI documentation |

---

## 🔐 JWT Token Flow

### Request Format
```http
GET /api/v1/workers/me HTTP/1.1
Host: api.hunar.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Token Refresh (Automatic)
```
1. Client sends request → 401 Unauthorized
2. Interceptor catches 401
3. POST /auth/refresh {refreshToken: "..."}
4. Get new accessToken
5. Retry original request with new token
6. If refresh fails → Clear tokens → Redirect to /login
```

### Token Storage

| Platform | Storage | Security |
|----------|---------|----------|
| Web | `localStorage` | XSS-vulnerable (use HttpOnly cookies in prod) |
| Android | `FlutterSecureStorage` → Android Keystore | Hardware-backed encryption |
| iOS | `FlutterSecureStorage` → iOS Keychain | Secure Enclave |

---

## 🔄 CORS Configuration

### API Server (server.ts)
```typescript
await app.register(cors, {
  origin: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  credentials: true,
});
```

### Allowed Origins
```env
# Development
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Production
CORS_ORIGINS=https://hunar.app,https://www.hunar.app
```

### AI Service (main.py)
```python
app.add_middleware(CORSMiddleware, allow_origins=["*"])  # Internal only
```

> **Note:** The AI service is NOT publicly accessible. It's only reachable from the API server on the internal Docker network.

---

## 📱 Mobile ↔ Backend Endpoint Mapping

The mobile app defines all endpoints in `api_endpoints.dart`. Here's the mapping to server routes:

| Mobile Constant | Server Route | Match |
|----------------|-------------|-------|
| `authRequestOtp` → `/auth/request-otp` | `/api/v1/auth/request-otp` | ✅ |
| `authVerifyOtp` → `/auth/verify-otp` | `/api/v1/auth/verify-otp` | ✅ |
| `authRefresh` → `/auth/refresh` | `/api/v1/auth/refresh` | ✅ |
| `workerMe` → `/workers/me` | `/api/v1/workers/me` | ✅ |
| `jobs` → `/jobs` | `/api/v1/jobs` | ✅ |
| `aiExtractSkills` → `/ai/extract-skills` | `/api/v1/ai/extract-skills` | ✅ |
| `paymentInitiate` → `/payments/initiate` | `/api/v1/payments/initiate` | ✅ |

> **Note:** Mobile `baseUrl` includes `/api/v1` prefix, so all endpoint strings are relative.

---

## ⚠️ Known API Mismatches (Fixed)

| Web Client (`api.ts`) | Mobile Client (`api_endpoints.dart`) | Server Route | Issue |
|----------------------|-------------------------------------|-------------|-------|
| `/auth/send-otp` | `/auth/request-otp` | `/auth/request-otp` | ⚠️ Web uses `send-otp`, server uses `request-otp` |
| `/payments/create-order` | `/payments/initiate` | `/payments/initiate` | ⚠️ Web uses `create-order`, server uses `initiate` |
| `/employers/me/analytics` | `/employers/analytics` | `/employers/analytics` | ⚠️ Web adds extra `/me` |

> These mismatches are documented in `PRODUCTION_CHECKLIST.md` with fixes.

---

## 📊 Request/Response Examples

### Send OTP
```json
// POST /api/v1/auth/request-otp
// Request
{ "phone": "+919876543210" }

// Response 200
{ "message": "OTP sent successfully", "expiresIn": 600 }
```

### Verify OTP
```json
// POST /api/v1/auth/verify-otp
// Request
{ "phone": "+919876543210", "otp": "123456" }

// Response 200
{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci...",
  "user": {
    "id": "uuid",
    "phone": "+919876543210",
    "name": "Rajesh Kumar",
    "role": "WORKER",
    "verified": true
  }
}
```

### AI Skill Extraction
```json
// POST /api/v1/ai/extract-skills
// Request
{ "text": "main electrician hoon, wiring aur panel board karta hoon" }

// Response 200
{
  "skills": [
    { "name": "Electrician", "confidence": 0.95 },
    { "name": "Wiring", "confidence": 0.92 },
    { "name": "Panel Board", "confidence": 0.88 }
  ],
  "language": "hi"
}
```
