import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ProductService } from '../../services/product.service.js';
import { createProductSchema, updateProductSchema } from '@fushion/shared/validators';
import { z } from 'zod';

export async function productRoutes(fastify: FastifyInstance) {
  const productService = new ProductService(fastify.prisma);

  // ─── GET / ─────────────────────────────────────────────
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Products'],
        description: 'List products with cursor pagination and filters',
        querystring: {
          type: 'object',
          properties: {
            cursor: { type: 'string' },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            categoryId: { type: 'string' },
            vendorId: { type: 'string' },
            status: { type: 'string' },
            minPrice: { type: 'number' },
            maxPrice: { type: 'number' },
            search: { type: 'string' },
            sortBy: { type: 'string', enum: ['createdAt', 'price', 'rating', 'sold', 'name'] },
            sortOrder: { type: 'string', enum: ['asc', 'desc'] },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as any;
      const result = await productService.list({
        cursor: query.cursor,
        limit: query.limit ? parseInt(query.limit) : 20,
        categoryId: query.categoryId,
        vendorId: query.vendorId,
        status: query.status,
        minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
        maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
        search: query.search,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      });

      return reply.send({ success: true, ...result });
    },
  );

  // ─── GET /:id ──────────────────────────────────────────
  fastify.get(
    '/:id',
    {
      schema: {
        tags: ['Products'],
        description: 'Get a single product by ID or slug',
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
          required: ['id'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;

      // Check if it's a UUID or a slug
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      const product = isUuid
        ? await productService.getById(id)
        : await productService.getBySlug(id);

      return reply.send({ success: true, data: product });
    },
  );

  // ─── POST / ────────────────────────────────────────────
  fastify.post(
    '/',
    {
      schema: {
        tags: ['Products'],
        description: 'Create a new product (requires VENDOR role)',
        security: [{ bearerAuth: [] }],
      },
      preHandler: [fastify.requireRole('VENDOR')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = createProductSchema.parse(request.body);

      // Get vendor ID for this user
      const vendor = await fastify.prisma.vendor.findUnique({
        where: { userId: request.user!.userId },
        select: { id: true, status: true },
      });

      if (!vendor || vendor.status !== 'ACTIVE') {
        return reply.status(403).send({
          success: false,
          error: {
            code: 'VENDOR_NOT_ACTIVE',
            message: 'Your vendor account must be active to create products',
          },
        });
      }

      const product = await productService.create(vendor.id, data);

      return reply.status(201).send({ success: true, data: product });
    },
  );

  // ─── PATCH /:id ────────────────────────────────────────
  fastify.patch(
    '/:id',
    {
      schema: {
        tags: ['Products'],
        description: 'Update a product (vendor can only update their own)',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: { id: { type: 'string', format: 'uuid' } },
          required: ['id'],
        },
      },
      preHandler: [fastify.requireRole('VENDOR', 'ADMIN')],
    },
    async (request: any, reply: FastifyReply) => {
      const data = updateProductSchema.parse(request.body);

      const vendor = await fastify.prisma.vendor.findUnique({
        where: { userId: request.user!.userId },
        select: { id: true },
      });

      if (!vendor) {
        return reply.status(403).send({
          success: false,
          error: { code: 'NOT_A_VENDOR', message: 'Vendor profile not found' },
        });
      }

      const product = await productService.update(request.params.id, vendor.id, data);

      return reply.send({ success: true, data: product });
    },
  );

  // ─── DELETE /:id ───────────────────────────────────────
  fastify.delete(
    '/:id',
    {
      schema: {
        tags: ['Products'],
        description: 'Soft delete a product (vendor can only delete their own)',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: { id: { type: 'string', format: 'uuid' } },
          required: ['id'],
        },
      },
      preHandler: [fastify.requireRole('VENDOR', 'ADMIN')],
    },
    async (request: any, reply: FastifyReply) => {
      const vendor = await fastify.prisma.vendor.findUnique({
        where: { userId: request.user!.userId },
        select: { id: true },
      });

      if (!vendor) {
        return reply.status(403).send({
          success: false,
          error: { code: 'NOT_A_VENDOR', message: 'Vendor profile not found' },
        });
      }

      const result = await productService.softDelete(request.params.id, vendor.id);

      return reply.send({ success: true, data: result });
    },
  );

  // ─── POST /:id/images ─────────────────────────────────
  fastify.post(
    '/:id/images',
    {
      schema: {
        tags: ['Products'],
        description: 'Add images to a product (Cloudinary URLs)',
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: { id: { type: 'string', format: 'uuid' } },
          required: ['id'],
        },
      },
      preHandler: [fastify.requireRole('VENDOR')],
    },
    async (request: any, reply: FastifyReply) => {
      const imageSchema = z.object({
        images: z.array(
          z.object({
            url: z.string().url(),
            publicId: z.string(),
            altText: z.string().optional(),
          }),
        ).min(1).max(10),
      });

      const { images } = imageSchema.parse(request.body);

      const vendor = await fastify.prisma.vendor.findUnique({
        where: { userId: request.user!.userId },
        select: { id: true },
      });

      if (!vendor) {
        return reply.status(403).send({
          success: false,
          error: { code: 'NOT_A_VENDOR', message: 'Vendor profile not found' },
        });
      }

      const result = await productService.addImages(request.params.id, vendor.id, images);

      return reply.status(201).send({ success: true, data: result });
    },
  );
}
