# ✅ Production Checklist

## Pre-Deployment Verification

### 1. Code Quality

- [x] `flutter analyze` → **0 issues** (mobile app)
- [x] `flutter test` → **All tests pass**
- [x] `flutter build apk` → **APK builds successfully**
- [ ] `cd apps/api && npx tsc --noEmit` → TypeScript compiles clean
- [ ] `cd apps/web && npm run build` → Next.js production build succeeds
- [ ] `cd apps/web && npm run lint` → ESLint passes
- [ ] `python -m py_compile apps/ai-service/app/main.py` → Python compiles

### 2. API Endpoint Verification

| Endpoint | Method | Status |
|----------|--------|--------|
| `/health` | GET | ✅ Returns `{status: "ok"}` |
| `/docs` | GET | ✅ Swagger UI loads |
| `/api/v1/auth/request-otp` | POST | ✅ Sends OTP |
| `/api/v1/auth/verify-otp` | POST | ✅ Returns JWT |
| `/api/v1/workers/me` | GET | ✅ Returns profile |
| `/api/v1/jobs` | GET | ✅ Returns job list |
| `/api/v1/ai/extract-skills` | POST | ✅ Returns skills |

### 3. Database

- [ ] Prisma schema validates: `npx prisma validate`
- [ ] Migrations run clean: `npx prisma migrate deploy`
- [ ] Seed data loads: `npx prisma db seed`
- [ ] All 15 models created in PostgreSQL
- [ ] pgvector extension enabled
- [ ] uuid-ossp extension enabled
- [ ] Indexes created for query performance

### 4. Security

- [x] JWT secrets are min 32 characters
- [x] OTPs are SHA-256 hashed in database
- [x] Passwords are NOT used (OTP-only auth)
- [x] CORS is configured with specific origins
- [x] Rate limiting is enabled (Redis-backed)
- [x] Security headers via Helmet
- [x] Docker containers run as non-root (UID 1001)
- [x] `.env` is in `.gitignore`
- [ ] `HTTPS` enforced in production
- [ ] Razorpay webhook signature verification active
- [ ] Firebase service account key secured

### 5. Performance

- [x] Nginx gzip compression enabled
- [x] Static asset caching (365 days for `_next/static/`)
- [x] Database indexes on frequently queried columns
- [x] Redis caching for rate limiting
- [x] Docker multi-stage builds (minimal image size)
- [x] Next.js standalone output mode
- [ ] Image optimization configured (Cloudinary/S3)
- [ ] Connection pooling for PostgreSQL

### 6. Mobile App

- [x] All 22+ screens render without errors
- [x] Typed data classes for all mock data
- [x] Deprecated widgets migrated (Radio → custom tiles)
- [x] LucideIcons API v3.1.12 compatible
- [x] JWT stored in FlutterSecureStorage
- [x] Auto token refresh on 401
- [ ] Production API URL configured
- [ ] Android signing key generated
- [ ] iOS provisioning profile configured
- [ ] Push notification certificates
- [ ] ProGuard rules for release build

---

## ⚠️ Known Issues to Fix Before Production

### Issue 1: Web API Endpoint Mismatch

**File:** `apps/web/src/lib/api.ts`

The web client uses `/auth/send-otp` but the server route is `/auth/request-otp`:

```diff
export const authAPI = {
-  sendOtp: (phone: string) => api.post('/auth/send-otp', { phone }),
+  sendOtp: (phone: string) => api.post('/auth/request-otp', { phone }),
```

**Payment endpoint mismatch:**
```diff
export const paymentAPI = {
-  createOrder: (data: any) => api.post('/payments/create-order', data),
+  createOrder: (data: any) => api.post('/payments/initiate', data),
```

**Employer analytics path:**
```diff
export const employerAPI = {
-  getAnalytics: () => api.get('/employers/me/analytics'),
+  getAnalytics: () => api.get('/employers/analytics'),
```

### Issue 2: Mobile Hardcoded API URL

**File:** `apps/mobile/lib/core/api/api_endpoints.dart`

For production, implement environment-based URL selection:

```dart
static String get baseUrl {
  const env = String.fromEnvironment('API_BASE_URL',
    defaultValue: 'http://10.0.2.2:3001/api/v1');
  return env;
}
```

### Issue 3: Web Auth Store XSS Vulnerability

**File:** `apps/web/src/lib/store.ts`

JWT tokens in `localStorage` are vulnerable to XSS. For production, use HttpOnly cookies:

```typescript
// In API: Set tokens as HttpOnly cookies
reply.setCookie('access_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
  maxAge: 86400, // 24h
});
```

### Issue 4: AI Service CORS Too Permissive

**File:** `apps/ai-service/app/main.py`

```diff
app.add_middleware(
    CORSMiddleware,
-   allow_origins=["*"],
+   allow_origins=["http://api:3001", "http://localhost:3001"],
)
```

> This is low risk since the AI service is only accessible on the internal Docker network, but should be restricted for defense-in-depth.

---

## 📋 Deployment Day Checklist

### Before Deploy
- [ ] All environment variables set in production
- [ ] Database connection tested from deployment target
- [ ] SSL certificates ready (or auto via Vercel/Render)
- [ ] DNS records configured
- [ ] Backup of any existing data

### During Deploy
- [ ] Run database migrations
- [ ] Verify health endpoints
- [ ] Test OTP flow end-to-end
- [ ] Test one complete booking flow
- [ ] Verify CORS headers in browser DevTools
- [ ] Check API response times

### After Deploy
- [ ] Monitor error logs for first 24 hours
- [ ] Set up uptime monitoring (UptimeRobot, free)
- [ ] Configure Sentry for error tracking (free tier)
- [ ] Test mobile app against production API
- [ ] Distribute APK to testers

---

## 📊 Monitoring Recommendations (Free)

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| [UptimeRobot](https://uptimerobot.com) | Uptime monitoring | 50 monitors, 5 min intervals |
| [Sentry](https://sentry.io) | Error tracking | 5K events/month |
| [Supabase Dashboard](https://supabase.com) | DB metrics | Built-in |
| [Render Logs](https://render.com) | Server logs | Built-in |
| [Vercel Analytics](https://vercel.com) | Web performance | Free for hobby |
| Firebase Crashlytics | Mobile crash reports | Free |
