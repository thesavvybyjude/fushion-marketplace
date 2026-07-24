import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CategoryService } from '../../services/category.service.js';
import { ProductService } from '../../services/product.service.js';

export async function categoryRoutes(fastify: FastifyInstance) {
  const categoryService = new CategoryService(fastify.prisma);
  const productService = new ProductService(fastify.prisma);

  // ─── GET / ─────────────────────────────────────────────
  fastify.get(
    '/',
    {
      schema: {
        tags: ['Categories'],
        description: 'List all categories as a nested tree',
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const categories = await categoryService.getAll();

      return reply.send({ success: true, data: categories });
    },
  );

  // ─── GET /:slug ────────────────────────────────────────
  fastify.get(
    '/:slug',
    {
      schema: {
        tags: ['Categories'],
        description: 'Get a category by slug',
        params: {
          type: 'object',
          properties: { slug: { type: 'string' } },
          required: ['slug'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
      const category = await categoryService.getBySlug(request.params.slug);

      return reply.send({ success: true, data: category });
    },
  );

  // ─── GET /:slug/products ───────────────────────────────
  fastify.get(
    '/:slug/products',
    {
      schema: {
        tags: ['Categories'],
        description: 'List products in a category',
        params: {
          type: 'object',
          properties: { slug: { type: 'string' } },
          required: ['slug'],
        },
        querystring: {
          type: 'object',
          properties: {
            cursor: { type: 'string' },
            limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            sortBy: { type: 'string' },
            sortOrder: { type: 'string', enum: ['asc', 'desc'] },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { slug: string }; Querystring: any }>,
      reply: FastifyReply,
    ) => {
      // First get category ID from slug
      const category = await categoryService.getBySlug(request.params.slug);

      const query = request.query as any;
      const result = await productService.list({
        categoryId: category.id,
        cursor: query.cursor,
        limit: query.limit ? parseInt(query.limit) : 20,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      });

      return reply.send({ success: true, ...result });
    },
  );
}
