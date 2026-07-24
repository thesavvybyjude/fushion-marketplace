import { getRedis } from '../lib/redis.js';

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const redis = getRedis();
      if (redis.status !== 'ready') return null;
      const data = await redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    try {
      const redis = getRedis();
      if (redis.status !== 'ready') return;
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    try {
      const redis = getRedis();
      if (redis.status !== 'ready') return;
      if (!pattern.includes('*')) {
        await redis.del(pattern);
        return;
      }
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error(`Cache invalidate error for pattern ${pattern}:`, error);
    }
  }
}

export const cacheService = new CacheService();
