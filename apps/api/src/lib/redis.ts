/**
 * Redis client singleton using ioredis.
 * Used for: sessions, OTP, recommendation cache, rate limiting, event queue.
 * Gracefully handles missing/unavailable Redis (falls back to null).
 */

import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

function createRedisClient(): Redis | null {
  if (!REDIS_URL) {
    console.warn('⚠️  REDIS_URL not set — running without Redis (in-memory fallback)');
    return null;
  }

  try {
    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) {
          console.error('❌ Redis max retries exceeded, giving up');
          return null; // stop retrying
        }
        const delay = Math.min(times * 200, 2000);
        return delay;
      },
      lazyConnect: true, // Don't connect immediately — connect on first use
      connectTimeout: 5000,
      enableReadyCheck: false,
    });

    client.on('connect', () => {
      console.log('✅ Redis connected');
    });

    client.on('error', (err) => {
      console.error('❌ Redis error:', err.message);
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
