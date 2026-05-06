# ──────────────────────────────────────────────
# Hunar API — Production Dockerfile
# Monorepo-aware: copies @hunar/shared package
# ──────────────────────────────────────────────

# Stage 1: Install deps & build
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy root package files for workspace resolution
COPY package.json ./
COPY package-lock.json* ./

# Copy shared package (dependency of the API)
COPY packages/shared ./packages/shared

# Copy API package
COPY apps/api/package.json ./apps/api/
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/tsconfig.json ./apps/api/
COPY apps/api/src ./apps/api/src

# Install dependencies from root (workspace-aware)
RUN npm install --omit=dev --workspace=apps/api --include-workspace-root || npm install --omit=dev

# Generate Prisma client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build TypeScript
RUN npx tsc || true

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl dumb-init wget
RUN addgroup --system --gid 1001 hunar && \
    adduser --system --uid 1001 hunar

# Copy built artifacts
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./api_modules
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/packages/shared ./packages/shared

# Merge node_modules if api has its own
RUN cp -rn ./api_modules/* ./node_modules/ 2>/dev/null || true && rm -rf ./api_modules

USER hunar

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# dumb-init handles PID 1 properly for signal forwarding
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
