# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Active |

## Reporting a Vulnerability

If you discover a security vulnerability in Hunar, please **do NOT** open a public GitHub issue. Instead, report it responsibly:

### How to Report

1. **Email:** Send details to `security@hunar.app` (or your project security email)
2. **Include:**
   - A description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Any suggested fix (optional)

### What to Expect

- **Acknowledgement:** Within 48 hours
- **Assessment:** Within 7 days
- **Fix timeline:** Within 30 days for critical issues
- **Credit:** We'll credit you in the release notes (unless you prefer anonymity)

## Security Best Practices (for Deployment)

### Authentication & Authorization
- JWT access tokens expire in 24 hours; refresh tokens in 30 days
- OTP codes are hashed with SHA-256 before storage
- Refresh tokens are rotated on every use (one-time use)
- Invalidated tokens are blacklisted in Redis
- RBAC middleware enforces role-based access on every endpoint

### Data Protection
- All passwords and OTPs are hashed (never stored in plain text)
- Sensitive fields are excluded from API responses (`password`, `otpCode`, etc.)
- Database connections use TLS in production
- All environment secrets are kept in `.env` (never committed to git)

### API Security
- Rate limiting: 100 req/min (authenticated), 20 req/min (unauthenticated)
- CORS is restricted to allowed origins only
- Helmet.js sets secure HTTP headers
- Input validation via Zod schemas on every endpoint
- SQL injection prevented by Prisma's parameterized queries

### Infrastructure
- Docker containers run with minimal privileges
- PostgreSQL uses strong passwords (not defaults in production)
- Redis runs with `maxmemory-policy allkeys-lru` to prevent memory exhaustion
- Health checks on all containers

### Payment Security
- Razorpay webhook signatures are verified before processing
- Payment amounts are validated server-side
- Escrow pattern ensures workers are paid only after OTP-verified completion
- Platform fees are calculated server-side (not client-provided)

### Checklist for Production

- [ ] Change all default passwords and secrets
- [ ] Use `NODE_ENV=production`
- [ ] Enable HTTPS everywhere
- [ ] Set strong JWT secrets (32+ characters, random)
- [ ] Configure real SMS provider (not `console`)
- [ ] Restrict database access to application servers only
- [ ] Enable database connection pooling
- [ ] Set up log aggregation and monitoring
- [ ] Configure automated backups
- [ ] Enable Razorpay live mode with webhook verification
- [ ] Review and restrict CORS origins
- [ ] Set up DDoS protection (Cloudflare / AWS Shield)

## Dependencies

We regularly update dependencies to patch known vulnerabilities. Run:

```bash
npm audit
pip audit  # (for Python service)
```

---

Thank you for helping keep Hunar and its users safe! 🛡️
