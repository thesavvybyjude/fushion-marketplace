import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { PaymentService } from '../../services/payment.service.js';

const webhooksPlugin: FastifyPluginAsyncZod = async (fastify) => {
  const paymentService = new PaymentService(fastify.prisma);

  // POST /api/v1/webhooks/paystack
  fastify.post(
    '/paystack',
    {
      config: {
        rawBody: true, // Need raw body for HMAC signature verification
      }
    },
    async (request: any, reply: any) => {
      const signature = request.headers['x-paystack-signature'] as string;
      const secret = process.env.PAYSTACK_WEBHOOK_SECRET;

      if (!signature || !secret) {
        return reply.status(400).send({ error: 'Missing signature or secret' });
      }

      try {
        const body = request.body;
        const result = await paymentService.handlePaystackWebhook(body, signature, secret);

        return reply.status(200).send(result);
      } catch (error: any) {
        request.log.error('Paystack webhook error:', error);
        return reply.status(200).send({ error: error.message });
      }
    }
  );
};

export default webhooksPlugin;
