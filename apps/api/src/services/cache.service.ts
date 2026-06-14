import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
    });
    
    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (this.redis.status !== 'ready') return null;
    try {
      const data = await this.redis.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    if (this.redis.status !== 'ready') return;
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  async invalidate(pattern: string): Promise<void> {
    if (this.redis.status !== 'ready') return;
    try {
      // For simple keys without wildcards
      if (!pattern.includes('*')) {
        await this.redis.del(pattern);
        return;
      }
      
      // For wildcard patterns (e.g. prefix:*)
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error(`Cache invalidate error for pattern ${pattern}:`, error);
    }
  }

  async quit() {
    await this.redis.quit();
  }
}
