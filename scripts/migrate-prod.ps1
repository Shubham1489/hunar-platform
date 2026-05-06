# ══════════════════════════════════════════════════════════════
# Hunar — Database Migration Script (Production)
# Usage: .\scripts\migrate-prod.ps1
# ══════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

Write-Host "🗄️  Hunar Database Migration" -ForegroundColor Cyan
Write-Host "════════════════════════════════════" -ForegroundColor Cyan

# Check for DATABASE_URL
if (-not $env:DATABASE_URL) {
    Write-Host "❌ DATABASE_URL not set!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Set it first:" -ForegroundColor Yellow
    Write-Host '  $env:DATABASE_URL = "postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"' -ForegroundColor White
    Write-Host ""
    Write-Host "Get it from: https://supabase.com → Project → Settings → Database" -ForegroundColor White
    exit 1
}

Write-Host "✅ DATABASE_URL is set" -ForegroundColor Green
Write-Host ""

# Run migration
Push-Location apps/api
Write-Host "📦 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "🚀 Running migrations..." -ForegroundColor Yellow
npx prisma migrate deploy

Write-Host ""
$seed = Read-Host "Do you want to seed the database with demo data? (y/N)"
if ($seed -eq "y" -or $seed -eq "Y") {
    Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
    npx tsx prisma/seed.ts
    Write-Host "✅ Database seeded" -ForegroundColor Green
}

Pop-Location

Write-Host ""
Write-Host "════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Database migration complete!" -ForegroundColor Green
Write-Host "════════════════════════════════════" -ForegroundColor Cyan
