# ──────────────────────────────────────────────
# Hunar API — Production Dockerfile (Fixed)
# Multi-stage, non-root, health check ready
# ──────────────────────────────────────────────

# Stage 1: Install deps & build
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files first (cache layer)
COPY package.json ./
RUN npm install --omit=dev

# Copy Prisma schema & generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source & build
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl dumb-init wget
RUN addgroup --system --gid 1001 hunar && \
    adduser --system --uid 1001 hunar

# Copy built artifacts
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

# dumb-init handles PID 1 properly for signal forwarding
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
