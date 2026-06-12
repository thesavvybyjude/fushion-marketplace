import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

export const swaggerPlugin = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'Fushion API',
          description:
            'Multi-vendor e-commerce marketplace API. Every market. One place.',
          version: '1.0.0',
          contact: {
            name: 'Fushion Team',
            url: 'https://fushion.ng',
          },
        },
        servers: [
          { url: 'http://localhost:3001', description: 'Development' },
          { url: 'https://api-staging.fushion.ng', description: 'Staging' },
          { url: 'https://api.fushion.ng', description: 'Production' },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Vendors', description: 'Vendor management' },
          { name: 'Products', description: 'Product catalogue' },
          { name: 'Categories', description: 'Product categories' },
          { name: 'Orders', description: 'Order management' },
          { name: 'Payments', description: 'Payment processing' },
          { name: 'Health', description: 'Health checks' },
        ],
      },
    });

    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: true,
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
    });
  },
  { name: 'swagger' },
);
