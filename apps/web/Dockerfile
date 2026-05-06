# ──────────────────────────────────────────────
# Hunar Web — Production Dockerfile (Fixed)
# Multi-stage Next.js standalone build
# ──────────────────────────────────────────────

# Stage 1: Install & Build
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build-time env vars
ARG NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

COPY package.json ./
RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 hunar && \
    adduser --system --uid 1001 hunar

# Copy Next.js standalone build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER hunar

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["node", "server.js"]
