import * as Sentry from '@sentry/node';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  if (!process.env.SENTRY_DSN) {
    fastify.log.warn('Sentry DSN not provided. Skipping Sentry initialization.');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  });

  fastify.log.info('Sentry initialized');
});
