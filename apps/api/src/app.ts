import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import cookie from '@fastify/cookie';
import { prismaPlugin } from './plugins/prisma.js';
import { swaggerPlugin } from './plugins/swagger.js';
import { authPlugin } from './plugins/auth.js';
import { errorHandler } from './middleware/error.handler.js';
import { authRoutes } from './routes/auth/index.js';
import { vendorRoutes } from './routes/vendors/index.js';
import { productRoutes } from './routes/products/index.js';
import { categoryRoutes } from './routes/categories/index.js';
import { healthRoutes } from './routes/health/index.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
    genReqId: () => crypto.randomUUID(),
  });

  // ─── Security ──────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
  });

  await app.register(cors, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'fushion-cookie-secret-change-me',
    parseOptions: {},
  });

  // ─── Plugins ───────────────────────────────────────────
  await app.register(prismaPlugin);
  await app.register(swaggerPlugin);
  await app.register(authPlugin);

  // ─── Error Handling ────────────────────────────────────
  app.setErrorHandler(errorHandler);

  // ─── Routes ────────────────────────────────────────────
  await app.register(healthRoutes, { prefix: '/api/v1' });
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(vendorRoutes, { prefix: '/api/v1/vendors' });
  await app.register(productRoutes, { prefix: '/api/v1/products' });
  await app.register(categoryRoutes, { prefix: '/api/v1/categories' });

  return app;
}
