import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

const adminPlugin: FastifyPluginAsyncZod = async (fastify) => {
  // GET /api/v1/admin/stats
  fastify.get(
    '/stats',
    {
      onRequest: [fastify.requireAuth, fastify.requireRole('ADMIN')],
      schema: {
        summary: 'Get marketplace aggregate statistics',
        response: {
          200: z.object({
            success: z.boolean(),
            data: z.object({
              totalSales: z.number(),
              activeVendors: z.number(),
              pendingProducts: z.number(),
              totalOrders: z.number(),
            })
          })
        }
      }
    },
    async (request, reply) => {
      // Aggregations
      const [
        totalSales,
        activeVendors,
        pendingProducts,
        totalOrders
      ] = await Promise.all([
        fastify.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: 'CONFIRMED' } }),
        fastify.prisma.vendor.count({ where: { status: 'ACTIVE' } }),
        fastify.prisma.product.count({ where: { status: 'PENDING_APPROVAL' } }),
        fastify.prisma.order.count(),
      ]);

      return {
        success: true,
        data: {
          totalSales: Number(totalSales._sum.totalAmount || 0),
          activeVendors,
          pendingProducts,
          totalOrders,
        }
      };
    }
  );

  // GET /api/v1/admin/products/pending
  fastify.get(
    '/products/pending',
    {
      onRequest: [fastify.requireAuth, fastify.requireRole('ADMIN')],
      schema: {
        summary: 'List products awaiting approval',
      }
    },
    async (request, reply) => {
      const products = await fastify.prisma.product.findMany({
        where: { status: 'PENDING_APPROVAL' },
        include: { vendor: true, images: true },
        orderBy: { createdAt: 'desc' },
      });

      return { success: true, data: products };
    }
  );

  // PATCH /api/v1/admin/products/:id/status
  fastify.patch(
    '/products/:id/status',
    {
      onRequest: [fastify.requireAuth, fastify.requireRole('ADMIN')],
      schema: {
        summary: 'Approve or reject a product',
        params: z.object({ id: z.string().uuid() }),
        body: z.object({ status: z.enum(['ACTIVE', 'REJECTED']) }),
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const { status } = request.body;

      const product = await fastify.prisma.product.update({
        where: { id },
        data: { status },
      });

      // If active, it should be indexed in Typesense (handled by a queue or SearchService ideally)
      return { success: true, data: product };
    }
  );
};

export default adminPlugin;
