# ══════════════════════════════════════════════════════════════
# Hunar — Windows Deploy Script (PowerShell)
# Usage: .\scripts\deploy.ps1
# ══════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

Write-Host "`n🚀 Hunar Deployment Script" -ForegroundColor Cyan
Write-Host "════════════════════════════════════" -ForegroundColor Cyan

# ─── Step 1: Verify prerequisites ─────────────
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

try { $nodeVer = node -v } catch { Write-Host "❌ Node.js is required." -ForegroundColor Red; exit 1 }
Write-Host "✅ Node.js $nodeVer" -ForegroundColor Green

# ─── Step 2: Install dependencies ─────────────
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm ci
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# ─── Step 3: Build API ────────────────────────
Write-Host "`n🔧 Building API..." -ForegroundColor Yellow
Push-Location apps/api
npx prisma generate
npx tsc
Pop-Location
Write-Host "✅ API built successfully" -ForegroundColor Green

# ─── Step 4: Build Web ────────────────────────
Write-Host "`n🌐 Building Web..." -ForegroundColor Yellow
Push-Location apps/web
npm run build
Pop-Location
Write-Host "✅ Web built successfully" -ForegroundColor Green

# ─── Step 5: Validate AI service ─────────────
Write-Host "`n🤖 Validating AI service..." -ForegroundColor Yellow
try {
    python -m py_compile apps/ai-service/app/main.py
    Write-Host "✅ AI service validated" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Python not found — skipping AI validation" -ForegroundColor Yellow
}

# ─── Step 6: Run Mobile Analysis (if Flutter available) ───
try {
    $flutterVer = flutter --version 2>$null
    if ($flutterVer) {
        Write-Host "`n📱 Analyzing Mobile App..." -ForegroundColor Yellow
        Push-Location apps/mobile
        flutter analyze
        Pop-Location
        Write-Host "✅ Mobile app clean" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Flutter not found — skipping mobile analysis" -ForegroundColor Yellow
}

# ─── Summary ─────────────────────────────────
Write-Host "`n════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 All services built successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Deploy Web:  cd apps/web; npx vercel" -ForegroundColor White
Write-Host "  2. Deploy API:  Push to GitHub -> Render auto-deploys" -ForegroundColor White
Write-Host "  3. Deploy AI:   Push to GitHub -> Render auto-deploys" -ForegroundColor White
Write-Host "  4. Build APK:   cd apps/mobile; flutter build apk --release" -ForegroundColor White
Write-Host ""
Write-Host "📚 Full guide: DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host "════════════════════════════════════" -ForegroundColor Cyan
