# 🚀 Free Deployment Guide

## Recommended FREE Deployment Stack

| Service | Platform | Free Tier | Why |
|---------|----------|-----------|-----|
| **Frontend Web** | [Vercel](https://vercel.com) | Unlimited deploys, auto HTTPS | Built for Next.js, zero config |
| **Backend API** | [Render](https://render.com) | 750 hrs/month, auto-deploy | Free Docker support, easy setup |
| **AI Service** | [Render](https://render.com) | 750 hrs/month | Python support, Dockerfile |
| **Database** | [Supabase](https://supabase.com) | 500MB, 2 projects | Free PostgreSQL, auto backups |
| **Redis Cache** | [Upstash](https://upstash.com) | 10K commands/day | Free Redis, serverless |
| **File Storage** | [Cloudinary](https://cloudinary.com) | 25GB bandwidth | Free image/file CDN |
| **Mobile APK** | [GitHub Releases](https://github.com) | Unlimited | Free file hosting, versioned |
| **CI/CD** | [GitHub Actions](https://github.com) | 2000 min/month | Free, already configured |

**Total monthly cost: $0**

---

## Step-by-Step Deployment

### Step 1: Database (Supabase)

1. Go to [supabase.com](https://supabase.com) → Sign up → New Project
2. Choose region: **Mumbai (ap-south-1)** for India users
3. Set a strong database password
4. Once created, go to **Settings → Database → Connection string**
5. Copy the **URI** format:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
6. **Run Prisma migration:**
   ```bash
   cd apps/api
   # Set the production DATABASE_URL
   set DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   npx prisma migrate deploy
   npx prisma db seed   # Optional: seed with demo data
   ```

---

### Step 2: Redis (Upstash)

1. Go to [upstash.com](https://upstash.com) → Sign up → Create Database
2. Choose region: **ap-south-1** (Mumbai)
3. Copy the **Redis URL**:
   ```
   rediss://default:[password]@[region].upstash.io:6379
   ```
4. Save this for the API environment variables

---

### Step 3: Backend API (Render)

1. Go to [render.com](https://render.com) → Sign up → New → **Web Service**
2. Connect your GitHub repo → Select `hunar` repository
3. Configure:
   - **Name:** `hunar-api`
   - **Root Directory:** `apps/api`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `./Dockerfile`
   - **Instance Type:** Free

4. **Environment Variables** (add in Render dashboard):
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<Supabase URL from Step 1>
   REDIS_URL=<Upstash URL from Step 2>
   JWT_ACCESS_SECRET=<generate with: openssl rand -hex 32>
   JWT_REFRESH_SECRET=<generate with: openssl rand -hex 32>
   JWT_ACCESS_EXPIRY=24h
   JWT_REFRESH_EXPIRY=30d
   SMS_PROVIDER=console
   CORS_ORIGINS=https://hunar-web.vercel.app
   AI_SERVICE_URL=https://hunar-ai.onrender.com
   ```

5. Click **Create Web Service** → Wait for build (~5min)
6. Your API is live at: `https://hunar-api.onrender.com`

> **⚠️ Free Tier Note:** Render spins down after 15 min of inactivity. First request takes ~30s to cold start.

---

### Step 4: AI Service (Render)

1. Render Dashboard → New → **Web Service**
2. Same GitHub repo → Configure:
   - **Name:** `hunar-ai`
   - **Root Directory:** `apps/ai-service`
   - **Environment:** `Docker`
   - **Dockerfile Path:** `./Dockerfile`
   - **Instance Type:** Free

3. **Environment Variables:**
   ```
   PYTHONUNBUFFERED=1
   AI_SERVICE_PORT=8000
   ```

4. Click **Create Web Service**
5. Live at: `https://hunar-ai.onrender.com`

---

### Step 5: Frontend Web (Vercel)

1. Go to [vercel.com](https://vercel.com) → Sign up → **Import Git Repository**
2. Select `hunar` repo → Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://hunar-api.onrender.com/api/v1
   ```

4. Click **Deploy** → Wait (~2min)
5. Live at: `https://hunar-web.vercel.app` (custom domain available free)

6. **Update CORS:** Go back to Render → `hunar-api` → Environment → Update:
   ```
   CORS_ORIGINS=https://hunar-web.vercel.app,https://your-custom-domain.com
   ```

---

### Step 6: Mobile App (Build & Distribute)

#### Build Release APK
```bash
cd apps/mobile

# Update API URL for production
# Edit lib/core/api/api_endpoints.dart:
# static const String baseUrl = 'https://hunar-api.onrender.com/api/v1';

# Build APK
flutter build apk --release

# Output: build/app/outputs/flutter-apk/app-release.apk
```

#### Distribute via GitHub Releases
1. Go to your GitHub repo → **Releases** → **Create new release**
2. Tag: `v1.0.0`
3. Title: `Hunar v1.0.0 - Initial Release`
4. Upload `app-release.apk`
5. Share the download link

#### Alternative: Firebase App Distribution (Free)
```bash
# Install Firebase CLI
npm install -g firebase-tools
firebase login

# Distribute
firebase appdistribution:distribute \
  build/app/outputs/flutter-apk/app-release.apk \
  --app YOUR_FIREBASE_APP_ID \
  --groups "testers"
```

---

### Step 7: File Storage (Cloudinary)

1. Go to [cloudinary.com](https://cloudinary.com) → Sign up (free)
2. Get your **Cloud Name**, **API Key**, **API Secret**
3. Add to Render API environment:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

---

## 🔧 Post-Deployment Checklist

### 1. Update CORS
After deploying the web app, update the API's `CORS_ORIGINS`:
```
CORS_ORIGINS=https://hunar-web.vercel.app
```

### 2. Run Database Migration
```bash
# From your local machine with production DATABASE_URL
cd apps/api
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

### 3. Verify Health Endpoints
```bash
# API health
curl https://hunar-api.onrender.com/health

# AI service health
curl https://hunar-ai.onrender.com/health

# Web app
curl https://hunar-web.vercel.app
```

### 4. Update Mobile App
Edit `apps/mobile/lib/core/api/api_endpoints.dart`:
```dart
static const String baseUrl = 'https://hunar-api.onrender.com/api/v1';
```
Rebuild and distribute the APK.

### 5. Custom Domain (Optional, Free)

**Vercel:**
1. Dashboard → Project Settings → Domains
2. Add `hunar.app` or `app.hunar.app`
3. Update DNS records as shown

**Render:**
1. Dashboard → Service → Settings → Custom Domains
2. Add `api.hunar.app`
3. Update DNS CNAME record

---

## 🏗️ Architecture with Free Stack

```
                    ┌─────────────────────────┐
                    │    Vercel (Free)         │
                    │    Next.js Web App       │
                    │    hunar-web.vercel.app   │
                    └──────────┬──────────────┘
                               │ HTTPS
                               ▼
                    ┌─────────────────────────┐
                    │    Render (Free)         │
                    │    Fastify API           │
                    │    hunar-api.onrender.com│
                    └──┬──────────┬───────────┘
                       │          │
              ┌────────▼───┐  ┌──▼───────────┐
              │ Supabase   │  │ Render (Free) │
              │ PostgreSQL │  │ FastAPI AI    │
              │ (Free)     │  │ hunar-ai.     │
              └────────────┘  │ onrender.com  │
                              └───────────────┘
                    ┌─────────────────────────┐
                    │    Upstash (Free)        │
                    │    Redis Cache           │
                    └─────────────────────────┘

    📱 Flutter APK → GitHub Releases (Free)
    📁 File Storage → Cloudinary (Free)
```

---

## ⚠️ Free Tier Limitations

| Platform | Limitation | Impact | Workaround |
|----------|-----------|--------|------------|
| **Render** | Spins down after 15min idle | First request ~30s delay | Use [UptimeRobot](https://uptimerobot.com) to ping every 14min |
| **Supabase** | 500MB storage, pause after 1 week inactive | DB paused | Keep active or upgrade ($25/mo) |
| **Upstash** | 10K commands/day | Rate limiting may not work at scale | Upgrade when needed |
| **Vercel** | 100GB bandwidth/month | Sufficient for most apps | Use CDN images |
| **Cloudinary** | 25GB bandwidth, 25K transforms | Sufficient for dev/staging | Optimize images |

---

## 🔄 CI/CD with GitHub Actions

The existing `.github/workflows/ci-cd.yml` handles:
1. **Lint & Type Check** → On every PR
2. **Build API, Web, AI** → On every push
3. **Docker Build & Push** → On merge to `main`
4. **Deploy** → SSH to production server

For free hosting (Vercel + Render), deployment is automatic:
- **Vercel**: Auto-deploys on `git push` to `main`
- **Render**: Auto-deploys on `git push` to `main`
- **No SSH deployment needed** for free tier
