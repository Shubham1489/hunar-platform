# Hunar Backend API

The Node.js/Fastify backend API powering the Hunar platform.

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Fastify 5
- **Language:** TypeScript 5
- **ORM:** Prisma 6 (PostgreSQL 15)
- **Cache:** Redis 7 (ioredis)
- **Auth:** JWT RS256 + OTP
- **Validation:** Zod

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start infrastructure
docker compose -f ../../infra/docker-compose.yml up -d

# Run database migrations
npx prisma migrate dev --name init

# Seed the database
npx ts-node prisma/seed.ts

# Start development server
npm run dev
# ✅ http://localhost:3001
# 📖 http://localhost:3001/docs (Swagger)
```

## Project Structure

```
src/
├── server.ts              # Entry point — Fastify server bootstrap
├── lib/
│   ├── prisma.ts          # Prisma client singleton
│   └── redis.ts           # Redis client connection
├── middleware/
│   ├── authenticate.ts    # JWT verification middleware
│   ├── authorize.ts       # RBAC role-checking middleware
│   └── errorHandler.ts    # Global error handler
├── modules/
│   ├── auth/              # OTP → JWT auth flow
│   ├── workers/           # Worker profiles & skills
│   ├── jobs/              # Job listings & applications
│   ├── employers/         # Employer features & analytics
│   ├── customers/         # Service requests & bookings
│   ├── payments/          # Razorpay integration & escrow
│   ├── ratings/           # Reviews & reporting
│   ├── notifications/     # Push notification inbox
│   ├── admin/             # Admin panel APIs
│   └── ai/               # AI service proxy
└── utils/
    └── response.ts        # Standardized response helpers
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start dev server with hot-reload |
| `build` | `npm run build` | Build for production |
| `start` | `npm start` | Start production server |
| `prisma:generate` | `npx prisma generate` | Generate Prisma client |
| `prisma:migrate` | `npx prisma migrate dev` | Create & apply migration |
| `prisma:seed` | `npx ts-node prisma/seed.ts` | Seed database |
| `prisma:studio` | `npx prisma studio` | Visual database browser |
| `prisma:reset` | `npx prisma migrate reset` | Reset DB & re-seed |

## Environment Variables

See [`../../.env.example`](../../.env.example) for all variables. Key ones:

```bash
DATABASE_URL=postgresql://hunar:hunar_secret@localhost:5432/hunar_db
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your-32-char-secret
PORT=3001
AI_SERVICE_URL=http://localhost:8000
```

## API Modules

| Module | Prefix | Roles | Description |
|--------|--------|-------|-------------|
| Auth | `/auth` | Public | OTP login, JWT tokens |
| Workers | `/workers` | Worker | Profile, skills, recommendations |
| Jobs | `/jobs` | All | Search, apply, manage |
| Employers | `/employers` | Employer | Job posting, hiring |
| Customers | `/customers` | Customer | Bookings, services |
| Payments | `/payments` | All | Razorpay, escrow |
| Ratings | `/ratings` | All | Reviews |
| Notifications | `/notifications` | All | Inbox |
| Admin | `/admin` | Admin | Platform management |
| AI | `/ai` | All | ML proxy |

## Database

15 Prisma models — see [`prisma/schema.prisma`](prisma/schema.prisma) for the complete schema.

```bash
# Explore the database visually
npx prisma studio
```
