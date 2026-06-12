import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { PaymentService } from '../../services/payment.service';

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
    async (request, reply) => {
      const signature = request.headers['x-paystack-signature'] as string;
      const secret = process.env.PAYSTACK_WEBHOOK_SECRET;

      if (!signature || !secret) {
        return reply.status(400).send({ error: 'Missing signature or secret' });
      }

      try {
        const body = request.body;
        const result = await paymentService.handlePaystackWebhook(body, signature, secret);
        
        // Paystack expects a 200 OK immediately
        return reply.status(200).send(result);
      } catch (error: any) {
        request.log.error('Paystack webhook error:', error);
        // Do not return 500 to Paystack unless we want them to retry. 
        // 400 is better for signature failures.
        return reply.status(400).send({ error: error.message });
      }
    }
  );
};

export default webhooksPlugin;
