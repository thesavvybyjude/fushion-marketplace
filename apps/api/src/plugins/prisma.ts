import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';
import type { FastifyInstance } from 'fastify';

// Singleton PrismaClient — avoids multiple instances during hot reload
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
});

// Soft delete middleware — filter deleted records by default
// Soft delete middleware is now handled via Prisma Client Extensions in v5+
// (Omitted for MVP)

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
