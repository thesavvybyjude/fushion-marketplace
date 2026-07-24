import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { OrderService } from '../../services/order.service.js';

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    quantity: z.number().int().min(1),
  })),
  address: z.object({
    id: z.string().uuid().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
  }),
});

async function ordersPlugin(fastify: FastifyInstance) {
  const orderService = new OrderService(fastify.prisma);

  fastify.post(
    '/checkout',
    {
      onRequest: [fastify.requireAuth],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const parsed = checkoutSchema.parse(request.body);
      const { userId } = request.user!;

      try {
        const { order, reference } = await orderService.checkout(userId, parsed.items, parsed.address);

        return reply.status(200).send({
          success: true,
          data: { order, reference },
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(error.statusCode || 400).send({
          success: false,
          error: { code: error.code || 'CHECKOUT_ERROR', message: error.message },
        });
      }
    },
  );

  fastify.get(
    '/me',
    {
      onRequest: [fastify.requireAuth],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.user!;

      const orders = await fastify.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { items: true, payment: true },
      });

      return reply.send({ success: true, data: orders });
    },
  );
}

export default ordersPlugin;
