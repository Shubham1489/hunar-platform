# ──────────────────────────────────────────────
# Hunar API — Production Dockerfile
# ──────────────────────────────────────────────

FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

# 1. Copy API package.json
COPY apps/api/package.json ./package.json

# 2. Copy shared package source
COPY packages/shared ./hunar-shared

# 3. Build the shared package (TS → JS in dist/)
RUN cd hunar-shared && npm install && npx tsc

# 4. Patch shared package.json: point main to compiled JS
RUN sed -i 's|"main": "src/index.ts"|"main": "dist/index.js"|' hunar-shared/package.json

# 5. Point @hunar/shared to local folder
RUN sed -i 's|"@hunar/shared": "\*"|"@hunar/shared": "file:./hunar-shared"|' package.json

# 6. Install all dependencies (dev + prod for building)
RUN npm install

# 7. Copy Prisma schema & generate client
COPY apps/api/prisma ./prisma
RUN npx prisma generate

# 8. Copy API source & build
COPY apps/api/tsconfig.json ./tsconfig.json
COPY apps/api/src ./src
RUN npx tsc

# 9. Verify build
RUN test -d dist && echo "Build OK"

# ── Stage 2: Production ──────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl dumb-init wget
RUN addgroup --system --gid 1001 hunar && \
    adduser --system --uid 1001 hunar

# Copy compiled API
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Copy node_modules (contains all runtime deps)
COPY --from=builder /app/node_modules ./node_modules

# CRITICAL: Copy the built shared package into node_modules
# (npm file: links use symlinks which break across Docker stages)
COPY --from=builder /app/hunar-shared ./node_modules/@hunar/shared

USER hunar

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
