/**
 * Redis client singleton using ioredis.
 * Used for: sessions, OTP, recommendation cache, rate limiting, event queue.
 * Gracefully handles missing/unavailable Redis (falls back to null).
 *
 * Supports Upstash (TLS required) — auto-detects from rediss:// URL scheme.
 */

import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

function createRedisClient(): Redis | null {
  if (!REDIS_URL) {
    console.warn('⚠️  REDIS_URL not set — running without Redis (in-memory fallback)');
    return null;
  }

  try {
    // Upstash and other managed Redis providers use rediss:// (TLS)
    const isTLS = REDIS_URL.startsWith('rediss://');

    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 10) {
          console.error('❌ Redis max retries exceeded, giving up');
          return null; // stop retrying
        }
        const delay = Math.min(times * 500, 5000);
        return delay;
      },
      reconnectOnError(err) {
        // Reconnect on EPIPE / connection reset errors
        const targetErrors = ['EPIPE', 'ECONNRESET', 'READONLY'];
        return targetErrors.some(e => err.message.includes(e));
      },
      lazyConnect: true,
      connectTimeout: 10000,
      enableReadyCheck: true,
      enableOfflineQueue: false, // Fail fast instead of queuing when disconnected
      keepAlive: 30000,          // Send TCP keep-alive every 30s (prevents idle disconnects)
      ...(isTLS ? { tls: { rejectUnauthorized: false } } : {}),
    });

    client.on('connect', () => {
      console.log('✅ Redis connected');
    });

    client.on('ready', () => {
      console.log('✅ Redis ready');
    });

    client.on('error', (err) => {
      // Only log unique errors, not repetitive noise
      console.error('❌ Redis error:', err.message);
    });

    client.on('close', () => {
      console.warn('⚠️  Redis connection closed');
    });

    // Attempt connection (non-blocking)
    client.connect().catch((err) => {
      console.warn('⚠️  Redis connection failed:', err.message);
    });

    return client;
  } catch (err) {
    console.warn('⚠️  Redis initialization failed, running without Redis');
    return null;
  }
}

export const redis = createRedisClient();

