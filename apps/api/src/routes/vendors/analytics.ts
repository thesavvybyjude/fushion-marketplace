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

      if (!vendor) {
        return reply.status(404).send({ success: false, error: { code: 'VENDOR_NOT_FOUND', message: 'Vendor not found' } });
      }

      const stats = await fastify.prisma.orderItem.aggregate({
        where: { vendorId: vendor.id },
        _sum: { vendorAmount: true, quantity: true },
        _count: { id: true }
      });

      const today = new Date();
      const chartData: Array<{ date: string; revenue: number }> = [];

      for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(day.getDate() - i);
        const dayStart = new Date(day.setHours(0, 0, 0, 0));
        const dayEnd = new Date(day.setHours(23, 59, 59, 999));

        const dayStats = await fastify.prisma.orderItem.aggregate({
          where: {
            vendorId: vendor.id,
            createdAt: { gte: dayStart, lte: dayEnd },
          },
          _sum: { vendorAmount: true },
        });

        chartData.push({
          date: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: Number(dayStats._sum.vendorAmount || 0),
        });
      }

      return reply.send({
        success: true,
        data: {
          gmv: Number(stats._sum.vendorAmount || 0),
          totalOrders: stats._count.id || 0,
          unitsSold: Number(stats._sum.quantity || 0),
          chartData,
        },
      });
    }
  );
}
