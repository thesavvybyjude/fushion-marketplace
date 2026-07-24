import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { OrderService } from '../../services/order.service.js';

const ordersPlugin: FastifyPluginAsyncZod = async (fastify) => {
  const orderService = new OrderService(fastify.prisma);

  // POST /api/v1/orders/checkout
  fastify.post(
    '/checkout',
    {
      onRequest: [fastify.requireAuth],
      schema: {
        summary: 'Initialize checkout order',
        body: z.object({
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
          })
        })
      }
    },
    async (request: any, reply: any) => {
      const { items, address } = request.body;
      const { userId } = request.user;

      try {
        const { order, reference } = await orderService.checkout(userId, items, address);
        
        return reply.status(200).send({
          success: true,
          data: {
            order,
            reference,
            // authorizationUrl would be returned here if we used standard Paystack initialize,
            // but for Paystack Inline, we just return the reference to the client.
          }
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(400).send({
          success: false,
          error: { message: error.message }
        });
      }
    }
  );

  // GET /api/v1/orders/me
  fastify.get(
    '/me',
    {
      onRequest: [fastify.requireAuth],
      schema: { summary: 'Get current buyer orders' }
    },
    async (request: any) => {
      const { userId } = request.user;

      const orders = await fastify.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          payment: true
        }
      });

      return { success: true, data: orders };
    }
  );
};

export default ordersPlugin;
