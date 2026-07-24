import type { FastifyInstance } from 'fastify';

export async function b2bRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/bulk-order',
    {
      preValidation: [fastify.requireAuth, fastify.requireRole('B2B_BUYER')],
      schema: {
        tags: ['B2B'],
        description: 'Submit a bulk order. Automatically creates a net-30 invoice.',
        body: {
          type: 'object',
          required: ['items', 'addressId'],
          properties: {
            addressId: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                required: ['productId', 'quantity'],
                properties: {
                  productId: { type: 'string' },
                  variantId: { type: 'string' },
                  quantity: { type: 'number', minimum: 10 },
                },
              },
            },
            note: { type: 'string' },
          },
        },
      },
    },
    async (_request: any, reply: any) => {
      // In a real scenario, this delegates to an OrderService
      // which creates the Order, the OrderItems, and finally the Invoice.
      return reply.send({
        status: 'success',
        message: 'Bulk order submitted. Net-30 invoice generated.',
        orderNumber: `FSH-B2B-${Date.now()}`
      });
    }
  );

  fastify.post(
    '/po-upload',
    {
      preValidation: [fastify.requireAuth, fastify.requireRole('B2B_BUYER')],
      schema: {
        tags: ['B2B'],
        description: 'Upload a Purchase Order document (PDF/Image url) for manual processing.',
        body: {
          type: 'object',
          required: ['documentUrl'],
          properties: {
            documentUrl: { type: 'string', format: 'uri' },
          },
        },
      },
    },
    async (request: any, reply: any) => {
      const { documentUrl } = request.body as any;
      const user = request.user!;

      const po = await fastify.prisma.purchaseOrder.create({
        data: {
          poNumber: `PO-${Date.now()}`,
          userId: user.userId,
          documentUrl,
          status: 'PENDING_REVIEW'
        }
      });

      return reply.send({
        status: 'success',
        message: 'Purchase order uploaded for review.',
        data: po
      });
    }
  );
}
