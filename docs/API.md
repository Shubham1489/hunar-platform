# Hunar — API Documentation

Complete guide to the Hunar REST API.

---

## Base Information

| Field | Value |
|-------|-------|
| **Base URL (Dev)** | `http://localhost:3001/api/v1` |
| **Base URL (Prod)** | `https://api.hunar.app/api/v1` |
| **Auth** | Bearer token (JWT) in `Authorization` header |
| **Format** | JSON |
| **Swagger UI** | `http://localhost:3001/docs` |

### Standard Response Format

```json
// Success
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 156 }
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Phone number must be 10 digits",
    "details": [ ... ]
  }
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| `200` | Success |
| `201` | Created |
| `400` | Validation error |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (wrong role) |
| `404` | Resource not found |
| `409` | Conflict (duplicate) |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## 1. Authentication

### POST `/auth/request-otp`

Request a one-time password via SMS.

**Body:**
```json
{
  "phone": "9876543210",
  "role": "WORKER"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "otpId": "550e8400-e29b-41d4-a716-446655440000",
    "expiresAt": "2026-04-09T12:10:00.000Z",
    "message": "OTP sent to 9876543210"
  }
}
```

> **Dev mode:** OTP is printed to the console and returned in the response.

---

### POST `/auth/verify-otp`

Verify OTP and receive JWT tokens.

**Body:**
```json
{
  "phone": "9876543210",
  "otp": "123456",
  "otpId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1Ni...",
    "refreshToken": "eyJhbGciOiJSUzI1Ni...",
    "expiresIn": 86400,
    "user": {
      "id": "user-uuid",
      "phone": "9876543210",
      "name": "Ramesh Kumar",
      "role": "WORKER",
      "isVerified": true
    }
  }
}
```

---

### POST `/auth/refresh`

Exchange a refresh token for a new access token.

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJSUzI1Ni..."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1Ni...",
    "refreshToken": "eyJhbGciOiJSUzI1Ni...",
    "expiresIn": 86400
  }
}
```

---

### POST `/auth/logout`

Invalidate the current session. 🔒 **Auth required.**

**Headers:** `Authorization: Bearer <accessToken>`

**Response (200):**
```json
{
  "success": true,
  "data": { "message": "Logged out successfully" }
}
```

---

### GET `/auth/me`

Get current authenticated user. 🔒 **Auth required.**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "phone": "9876543210",
    "name": "Ramesh Kumar",
    "role": "WORKER",
    "isVerified": true,
    "workerProfile": {
      "mode": "BOTH",
      "experienceYears": 8,
      "city": "Delhi",
      "isAvailable": true,
      "ratingAvg": 4.8,
      "skills": [
        { "name": "Electrician", "level": "EXPERT", "years": 8 },
        { "name": "Wiring", "level": "EXPERT", "years": 6 }
      ]
    }
  }
}
```

---

## 2. Jobs

### GET `/jobs`

Search and list jobs. **Public endpoint.**

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (title, skills) |
| `city` | string | Filter by city |
| `skill` | string | Filter by skill name |
| `type` | string | `PERMANENT`, `CONTRACT`, `ONEDAY` |
| `salaryMin` | number | Minimum daily salary |
| `salaryMax` | number | Maximum daily salary |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `sort` | string | `recent`, `salary_high`, `salary_low` |

**Example:** `GET /jobs?city=Delhi&skill=Electrician&salaryMin=800&sort=recent`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "job-uuid",
      "title": "Smart Home Wiring — 3BHK Apartment",
      "description": "Complete smart home wiring setup...",
      "skillsRequired": ["Smart Home", "Wiring", "Electrician"],
      "experienceMin": 3,
      "salaryMin": 1000,
      "salaryMax": 1500,
      "salaryType": "DAILY",
      "jobType": "CONTRACT",
      "city": "Noida",
      "status": "OPEN",
      "openings": 2,
      "employer": {
        "companyName": "TechHome Solutions",
        "logoUrl": null
      },
      "createdAt": "2026-04-07T10:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 45 }
}
```

---

### POST `/jobs/:id/apply`

Apply to a job. 🔒 **Worker only.**

**Response (201):**
```json
{
  "success": true,
  "data": {
    "applicationId": "app-uuid",
    "jobId": "job-uuid",
    "status": "APPLIED",
    "aiMatchScore": 87.5,
    "appliedAt": "2026-04-09T06:00:00.000Z"
  }
}
```

---

## 3. Workers

### GET `/workers/me`

Get the authenticated worker's profile. 🔒 **Worker only.**

### PUT `/workers/me`

Update worker profile. 🔒 **Worker only.**

**Body:**
```json
{
  "name": "Ramesh Kumar",
  "dailyRate": 1000,
  "hourlyRate": 150,
  "city": "Delhi",
  "lat": 28.6139,
  "lng": 77.2090,
  "bio": "Expert electrician with 8+ years experience",
  "isAvailable": true
}
```

### GET `/workers/me/recommendations`

Get AI-powered job recommendations. 🔒 **Worker only.**

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "jobId": "job-uuid",
      "title": "Smart Home Wiring",
      "company": "TechHome Solutions",
      "city": "Noida",
      "salary": "₹1,200/day",
      "matchScore": 95.2,
      "matchBreakdown": {
        "skillMatch": 0.97,
        "locationScore": 0.89,
        "recencyBonus": 0.95
      }
    }
  ]
}
```

---

## 4. Employers

### POST `/employers/jobs`

Create a new job posting. 🔒 **Employer only.**

**Body:**
```json
{
  "title": "Master Electrician for Factory",
  "description": "Looking for experienced electricians...",
  "skillsRequired": ["Electrician", "Circuit Board"],
  "experienceMin": 5,
  "salaryMin": 800,
  "salaryMax": 1200,
  "salaryType": "DAILY",
  "jobType": "PERMANENT",
  "city": "Delhi",
  "lat": 28.6139,
  "lng": 77.2090,
  "openings": 3
}
```

### GET `/employers/jobs/:id/applicants`

Get AI-ranked applicants for a job. 🔒 **Employer only.**

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "workerId": "worker-uuid",
      "name": "Suresh Yadav",
      "phone": "98765*****",
      "skills": ["Electrician", "Wiring"],
      "experienceYears": 12,
      "rating": 4.9,
      "matchScore": 96.1,
      "status": "APPLIED",
      "appliedAt": "2026-04-08T10:00:00.000Z"
    }
  ]
}
```

---

## 5. Customers

### POST `/customers/bookings`

Book a worker for a service. 🔒 **Customer only.**

**Body:**
```json
{
  "serviceRequestId": "sr-uuid",
  "workerId": "worker-uuid",
  "totalAmount": 800
}
```

### POST `/customers/bookings/:id/complete`

Generate OTP for job completion verification. 🔒 **Customer only.**

**Response (200):**
```json
{
  "success": true,
  "data": {
    "otp": "847293",
    "expiresAt": "2026-04-09T13:00:00.000Z",
    "message": "Share this OTP with the worker to confirm completion"
  }
}
```

---

## 6. Payments

### POST `/payments/initiate`

Create a Razorpay payment order. 🔒 **Auth required.**

**Body:**
```json
{
  "bookingId": "booking-uuid",
  "amount": 800
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "razorpayOrderId": "order_xxxxx",
    "amount": 80000,
    "currency": "INR",
    "key": "rzp_test_xxxx"
  }
}
```

---

## 7. AI Endpoints

### POST `/ai/extract-skills`

Extract skills from voice/text input. 🔒 **Auth required.**

**Body:**
```json
{
  "transcript": "main electrician hoon aur wiring ka kaam karta hoon"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "detectedLanguage": "hi",
    "translatedText": "I am an electrician and I do wiring work",
    "skills": [
      { "skill": "Electrician", "confidence": 1.0 },
      { "skill": "Wiring", "confidence": 1.0 }
    ]
  }
}
```

### POST `/ai/predict-salary`

Predict fair salary range. 🔒 **Auth required.**

**Body:**
```json
{
  "skills": ["Electrician", "Smart Home"],
  "experienceYears": 5,
  "city": "delhi",
  "jobType": "CONTRACT"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "dailyRateMin": 850,
    "dailyRateMedian": 1000,
    "dailyRateMax": 1200,
    "currency": "INR",
    "factors": {
      "baseRate": 600,
      "experienceMultiplier": 1.30,
      "cityMultiplier": 1.30,
      "typeMultiplier": 1.00
    }
  }
}
```

---

## Rate Limits

| Scope | Limit |
|-------|-------|
| Authenticated requests | 100 req/min |
| Unauthenticated requests | 20 req/min |
| OTP requests per phone | 5/hour |
| OTP verification attempts | 3/OTP |

When rate limited, the API returns:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later",
    "retryAfter": 60
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Missing or invalid token |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Duplicate resource |
| `OTP_EXPIRED` | OTP has expired |
| `OTP_INVALID` | Wrong OTP code |
| `OTP_MAX_ATTEMPTS` | Too many failed attempts |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `PAYMENT_FAILED` | Payment processing error |
| `INTERNAL_ERROR` | Server error |

---

## Pagination

All list endpoints support cursor-based pagination:

```
GET /jobs?page=2&limit=10

Response:
{
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 10,
    "total": 156,
    "totalPages": 16,
    "hasNext": true,
    "hasPrev": true
  }
}
```
