import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export async function vendorAnalyticsRoutes(fastify: FastifyInstance) {
  fastify.get(
    '/vendors/me/analytics',
    {
      preValidation: [fastify.requireAuth, fastify.requireRole('VENDOR')],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user!;
      
      const vendor = await fastify.prisma.vendor.findUnique({
        where: { userId: user.userId }
      });

      if (!vendor) return reply.status(404).send({ error: 'Vendor not found' });

      // Aggregate GMV and Total Orders
      const stats = await fastify.prisma.orderItem.aggregate({
        where: { vendorId: vendor.id },
        _sum: { vendorAmount: true, quantity: true },
        _count: { id: true }
      });

      // Daily revenue for the last 7 days (mocked for simplicity)
      const chartData = Array.from({ length: 7 }).map((_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: Math.floor(Math.random() * 50000) + 10000
      }));

      return reply.send({
        gmv: stats._sum.vendorAmount || 0,
        totalOrders: stats._count.id || 0,
        unitsSold: stats._sum.quantity || 0,
        chartData
      });
    }
  );
}
