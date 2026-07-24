import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { VendorService } from '../../services/vendor.service.js';
import { vendorOnboardingSchema } from '@fushion/shared/validators';
import { z } from 'zod';

export async function vendorRoutes(fastify: FastifyInstance) {
  const vendorService = new VendorService(fastify.prisma);

  // ─── POST /onboard ────────────────────────────────────
  fastify.post(
    '/onboard',
    {
      schema: {
        tags: ['Vendors'],
        description: 'Complete vendor onboarding (4 steps submitted at once)',
        security: [{ bearerAuth: [] }],
      },
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = vendorOnboardingSchema.parse(request.body);
      const vendor = await vendorService.onboard(request.user!.userId, data);

      return reply.status(201).send({
        success: true,
        data: vendor,
      });
    },
  );

  // ─── GET /me ───────────────────────────────────────────
  fastify.get(
    '/me',
    {
      schema: {
        tags: ['Vendors'],
        description: 'Get current vendor profile (requires VENDOR role)',
        security: [{ bearerAuth: [] }],
      },
      preHandler: [fastify.requireRole('VENDOR', 'ADMIN')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const vendor = await vendorService.getMyProfile(request.user!.userId);

      return reply.send({
        success: true,
        data: vendor,
      });
    },
  );

  // ─── PATCH /me ─────────────────────────────────────────
  fastify.patch(
    '/me',
    {
      schema: {
        tags: ['Vendors'],
        description: 'Update vendor profile',
        security: [{ bearerAuth: [] }],
      },
      preHandler: [fastify.requireRole('VENDOR', 'ADMIN')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const updateSchema = z.object({
        storeName: z.string().min(3).max(50).optional(),
        description: z.string().min(20).max(500).optional(),
        phone: z.string().min(10).max(15).optional(),
        whatsapp: z.string().min(10).max(15).optional(),
        logoUrl: z.string().url().optional(),
        bannerUrl: z.string().url().optional(),
      });

      const data = updateSchema.parse(request.body);
      const vendor = await vendorService.updateProfile(request.user!.userId, data);

      return reply.send({
        success: true,
        data: vendor,
      });
    },
  );

  // ─── GET /:id ──────────────────────────────────────────
  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Vendors'],
        description: 'Get public vendor profile',
        params: {
          type: 'object',
          properties: { id: { type: 'string', format: 'uuid' } },
          required: ['id'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const vendor = await vendorService.getPublicProfile(request.params.id);

      return reply.send({
        success: true,
        data: vendor,
      });
    },
  );
}
