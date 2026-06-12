import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

export class PaymentService {
  constructor(private prisma: PrismaClient) {}

  async handlePaystackWebhook(body: any, signature: string, secret: string) {
    // 1. Verify Signature using HMAC-SHA512
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(body)).digest('hex');
    
    if (hash !== signature) {
      throw new Error('Invalid signature');
    }

    const event = body.event;
    const data = body.data;

    // We only care about charge.success for fulfillment
    if (event === 'charge.success') {
      const reference = data.reference;
      
      // Look up payment
      const payment = await this.prisma.payment.findUnique({
        where: { paystackRef: reference }
      });

      if (!payment) {
        console.error(`Webhook error: Payment with ref ${reference} not found.`);
        return;
      }

      // Check Idempotency - if already SUCCESS, ignore
      if (payment.status === 'SUCCESS') {
        return { message: 'Already processed' };
      }

      // Verify amount (Paystack amount is in kobo, DB is in NGN)
      const paystackAmountNGN = data.amount / 100;
      if (Number(payment.amount) !== paystackAmountNGN) {
        console.error(`Webhook error: Amount mismatch for ref ${reference}. Expected ${payment.amount}, got ${paystackAmountNGN}`);
        // Flag for manual review, but still mark as successful from Paystack's perspective
      }

      // Update in transaction to prevent race conditions
      await this.prisma.$transaction(async (tx) => {
        // Mark payment successful
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            paystackTxnId: String(data.id),
            channel: data.channel,
            paidAt: new Date(data.paid_at),
            metadata: data,
          }
        });

        // Mark order confirmed
        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: 'CONFIRMED' }
        });

        // Reduce stock for all items
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: payment.orderId }
        });

        for (const item of orderItems) {
          if (item.variantId) {
            await tx.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } }
            });
          }
          
          await tx.product.update({
            where: { id: item.productId },
            data: { totalSold: { increment: item.quantity } }
          });
        }
      });
      
      return { message: 'Processed successfully' };
    }

    return { message: 'Event ignored' };
  }
}
