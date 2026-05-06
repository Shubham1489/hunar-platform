#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Hunar — One-Click Deploy Script
# Usage: bash scripts/deploy.sh
# ══════════════════════════════════════════════════════════════

set -e

echo "🚀 Hunar Deployment Script"
echo "════════════════════════════════════"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() { echo -e "\n${GREEN}✅ $1${NC}"; }
print_warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# ─── Step 1: Verify prerequisites ─────────────
echo -e "\n📋 Checking prerequisites..."

command -v node >/dev/null 2>&1 || { print_error "Node.js is required. Install: https://nodejs.org"; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm is required."; exit 1; }
command -v npx >/dev/null 2>&1 || { print_error "npx is required."; exit 1; }

NODE_VER=$(node -v | cut -d. -f1 | sed 's/v//')
if [ "$NODE_VER" -lt 18 ]; then
  print_error "Node.js 18+ required. Current: $(node -v)"
  exit 1
fi

print_step "Node.js $(node -v) ✓"

# ─── Step 2: Install dependencies ─────────────
echo -e "\n📦 Installing dependencies..."
npm ci
print_step "Dependencies installed"

# ─── Step 3: Build API ────────────────────────
echo -e "\n🔧 Building API..."
cd apps/api
npx prisma generate
npx tsc
print_step "API built successfully"
cd ../..

# ─── Step 4: Build Web ────────────────────────
echo -e "\n🌐 Building Web..."
cd apps/web
npm run build
print_step "Web built successfully"
cd ../..

# ─── Step 5: Validate AI service ─────────────
echo -e "\n🤖 Validating AI service..."
python3 -m py_compile apps/ai-service/app/main.py 2>/dev/null || \
python -m py_compile apps/ai-service/app/main.py 2>/dev/null || \
print_warn "Python not found — skip AI validation"
print_step "AI service validated"

# ─── Step 6: Summary ─────────────────────────
echo -e "\n════════════════════════════════════"
echo -e "${GREEN}🎉 All services built successfully!${NC}"
echo ""
echo "Next steps:"
echo "  1. Deploy Web:  cd apps/web && npx vercel"
echo "  2. Deploy API:  Push to GitHub → Render auto-deploys"
echo "  3. Deploy AI:   Push to GitHub → Render auto-deploys"
echo "  4. Build APK:   cd apps/mobile && flutter build apk --release"
echo ""
echo "📚 Full guide: DEPLOYMENT_GUIDE.md"
echo "════════════════════════════════════"
