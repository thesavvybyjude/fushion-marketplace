import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { SearchService } from '../../services/search.service.js';

const approveProductSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']),
});

async function adminPlugin(fastify: FastifyInstance) {
  fastify.get(
    '/stats',
    {
      onRequest: [fastify.requireAuth, fastify.requireRole('ADMIN')],
    },
    async (_request: any, _reply: any) => {
      const [totalSales, activeVendors, pendingProducts, totalOrders] = await Promise.all([
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
        },
      };
    },
  );

  fastify.get(
    '/products/pending',
    {
      onRequest: [fastify.requireAuth, fastify.requireRole('ADMIN')],
    },
    async (_request: any, _reply: any) => {
      const products = await fastify.prisma.product.findMany({
        where: { status: 'PENDING_APPROVAL' },
        include: { vendor: true, images: true },
        orderBy: { createdAt: 'desc' },
      });

      return { success: true, data: products };
    },
  );

  fastify.patch(
    '/products/:id/status',
    {
      onRequest: [fastify.requireAuth, fastify.requireRole('ADMIN')],
    },
    async (request: any, _reply: any) => {
      const { id } = request.params as { id: string };
      const { status } = approveProductSchema.parse(request.body);

      const product = await fastify.prisma.product.update({
        where: { id },
        data: { status },
        include: {
          vendor: { select: { storeName: true } },
          category: { select: { name: true } },
          images: { take: 1, orderBy: { sortOrder: 'asc' } },
        },
      });

      if (status === 'ACTIVE') {
        const searchService = new SearchService();
        searchService.indexProduct(product).catch((err) => {
          request.log.error({ err }, 'Failed to index product in Typesense');
        });
      }

      return { success: true, data: product };
    },
  );
}

export default adminPlugin;
