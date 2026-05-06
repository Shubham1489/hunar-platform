# ──────────────────────────────────────────────
# Hunar API — Production Dockerfile
# Simple flat build (no workspace magic)
# ──────────────────────────────────────────────

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

# 1. Copy API package.json and install ALL deps (including typescript)
COPY apps/api/package.json ./package.json

# 2. Copy shared package locally so @hunar/shared resolves
COPY packages/shared ./hunar-shared

# 3. Patch package.json to point @hunar/shared to local path
RUN sed -i 's|"@hunar/shared": "\*"|"@hunar/shared": "file:./hunar-shared"|' package.json

# 4. Install all dependencies (dev + prod)
RUN npm install

# 5. Copy Prisma schema & generate client
COPY apps/api/prisma ./prisma
RUN npx prisma generate

# 6. Copy source & build
COPY apps/api/tsconfig.json ./tsconfig.json
COPY apps/api/src ./src
RUN npx tsc

# 7. Verify build output exists
RUN test -d dist && echo "✅ TypeScript build successful" || (echo "❌ Build failed - dist/ not found" && exit 1)

# Stage 2: Production (lean)
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl dumb-init wget
RUN addgroup --system --gid 1001 hunar && \
    adduser --system --uid 1001 hunar

# Copy built code + deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

USER hunar

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
