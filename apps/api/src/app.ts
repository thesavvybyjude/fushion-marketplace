import Fastify from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
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
import orderRoutes from './routes/orders/index.js';
import webhookRoutes from './routes/webhooks/paystack.js';
import adminPlugin from './routes/admin/index.js';
import { b2bRoutes } from './routes/b2b/index.js';
import { vendorAnalyticsRoutes } from './routes/vendors/analytics.js';
import sentryPlugin from './plugins/sentry.js';

export async function buildApp() {
  // ─── Startup Validation ─────────────────────────────────
  const requiredVars = ['JWT_SECRET', 'COOKIE_SECRET'];
  for (const v of requiredVars) {
    if (!process.env[v]) {
      throw new Error(`FATAL: ${v} environment variable is required`);
    }
  }

  const app = Fastify({
    logger: {
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
    genReqId: () => crypto.randomUUID(),
  }).withTypeProvider<ZodTypeProvider>();

  // ─── Security ──────────────────────────────────────────
  await app.register(helmet, {
    contentSecurityPolicy: process.env.NODE_ENV === 'production',
  });

  const allowedOrigins = process.env.FRONTEND_URL 
    ? process.env.FRONTEND_URL.split(',').map(u => u.trim())
    : ['http://localhost:3000'];

  await app.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true);
        return;
      }
      cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET,
    parseOptions: {},
  });

  // ─── Plugins ───────────────────────────────────────────
  await app.register(prismaPlugin);
  await app.register(swaggerPlugin);
  await app.register(authPlugin);

  // ─── Sentry (before error handler — registers its own) ─
  await app.register(sentryPlugin);

  // ─── Error Handling ────────────────────────────────────
  app.setErrorHandler(errorHandler);

  // ─── Routes ────────────────────────────────────────────
  await app.register(healthRoutes, { prefix: '/api/v1' });
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(vendorRoutes, { prefix: '/api/v1/vendors' });
  await app.register(productRoutes, { prefix: '/api/v1/products' });
  await app.register(categoryRoutes, { prefix: '/api/v1/categories' });
  await app.register(orderRoutes, { prefix: '/api/v1/orders' });
  await app.register(webhookRoutes, { prefix: '/api/v1/webhooks' });
  await app.register(adminPlugin, { prefix: '/api/v1/admin' });
  await app.register(b2bRoutes, { prefix: '/api/v1/b2b' });
  await app.register(vendorAnalyticsRoutes, { prefix: '/api/v1' });

  return app;
}
