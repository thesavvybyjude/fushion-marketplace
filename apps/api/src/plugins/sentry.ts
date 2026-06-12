import { Sentry } from '@sentry/node';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  if (!process.env.SENTRY_DSN) {
    fastify.log.warn('Sentry DSN not provided. Skipping Sentry initialization.');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0, // Adjust in production
  });

  fastify.setErrorHandler(async (error, request, reply) => {
    // Report all 500 errors to Sentry
    if (error.statusCode === 500 || !error.statusCode) {
      Sentry.captureException(error, {
        user: {
          id: (request.user as any)?.userId,
        },
        tags: {
          path: request.url,
          method: request.method,
        }
      });
      
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        error: { message: 'Internal Server Error' }
      });
    }

    // Default fastify error response for 4xx
    return reply.status(error.statusCode || 400).send({
      success: false,
      error: {
        message: error.message,
        details: (error as any).details || undefined
      }
    });
  });
});
