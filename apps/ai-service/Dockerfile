# ─────────────────────────────────────────────
# Hunar AI Service — Production Dockerfile
# ─────────────────────────────────────────────

FROM python:3.11-slim AS builder

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc build-essential && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# Production stage
FROM python:3.11-slim AS runner

WORKDIR /app

# Create non-root user
RUN groupadd --gid 1001 hunar && \
    useradd --uid 1001 --gid hunar --shell /bin/bash hunar

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY app ./app

USER hunar

EXPOSE 8000

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
