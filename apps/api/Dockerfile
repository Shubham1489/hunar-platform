# ──────────────────────────────────────────────
# Hunar API — Production Dockerfile
# Builds @hunar/shared → then builds API
# ──────────────────────────────────────────────

FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

# 1. Copy API package.json
COPY apps/api/package.json ./package.json

# 2. Copy shared package source
COPY packages/shared ./hunar-shared

# 3. Patch @hunar/shared to use local file path
RUN sed -i 's|"@hunar/shared": "\*"|"@hunar/shared": "file:./hunar-shared"|' package.json

# 4. Install all dependencies (dev + prod)
RUN npm install

# 5. Build the shared package first (compiles TS → dist/)
RUN cd hunar-shared && npx tsc

# 6. Rebuild @hunar/shared link after build so dist/ is picked up
RUN npm install

# 7. Copy Prisma schema & generate client
COPY apps/api/prisma ./prisma
RUN npx prisma generate

# 8. Copy API source & build
COPY apps/api/tsconfig.json ./tsconfig.json
COPY apps/api/src ./src
RUN npx tsc

# 9. Verify
RUN test -d dist && echo "✅ API build OK" || (echo "❌ dist/ not found" && exit 1)

# ── Stage 2: Production ──────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl dumb-init wget
RUN addgroup --system --gid 1001 hunar && \
    adduser --system --uid 1001 hunar

# Copy compiled output + dependencies
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
