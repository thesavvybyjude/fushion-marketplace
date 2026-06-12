import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';

// Singleton PrismaClient — avoids multiple instances during hot reload
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

// Soft delete middleware — filter deleted records by default
prisma.$use(async (params, next) => {
  // Intercept findMany, findFirst, findUnique to exclude soft-deleted records
  const modelsWithSoftDelete = [
    'User',
    'Vendor',
    'Address',
    'Product',
    'Review',
  ];

  if (modelsWithSoftDelete.includes(params.model ?? '')) {
    if (params.action === 'findMany' || params.action === 'findFirst') {
      if (!params.args) params.args = {};
      if (!params.args.where) params.args.where = {};

      // Only add deletedAt filter if not explicitly querying for deleted records
      if (params.args.where.deletedAt === undefined) {
        params.args.where.deletedAt = null;
      }
    }
  }

  return next(params);
});

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export const prismaPlugin = fp(
  async (fastify: FastifyInstance) => {
    await prisma.$connect();
    fastify.log.info('✅ Database connected');

    fastify.decorate('prisma', prisma);

    fastify.addHook('onClose', async () => {
      await prisma.$disconnect();
      fastify.log.info('Database disconnected');
    });
  },
  { name: 'prisma' },
);
