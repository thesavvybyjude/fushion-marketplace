import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { EmailService } from './email.service.js';

export class PaymentService {
  constructor(
    private prisma: PrismaClient,
    private emailService: EmailService = new EmailService(),
  ) {}

  async handlePaystackWebhook(body: any, signature: string, secret: string) {
    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(body)).digest('hex');

    if (hash !== signature) {
      throw Object.assign(new Error('Invalid signature'), {
        statusCode: 400,
        code: 'INVALID_SIGNATURE',
      });
    }

    const event = body.event;
    const data = body.data;

    if (event === 'charge.success') {
      const reference = data.reference;

      const payment = await this.prisma.payment.findUnique({
        where: { paystackRef: reference }
      });

      if (!payment) {
        console.error(`Webhook error: Payment with ref ${reference} not found.`);
        return { message: 'Payment not found' };
      }

      if (payment.status === 'SUCCESS') {
        return { message: 'Already processed' };
      }

      const paystackAmountNGN = data.amount / 100;
      if (Number(payment.amount) !== paystackAmountNGN) {
        console.error(`Webhook error: Amount mismatch for ref ${reference}. Expected ${payment.amount}, got ${paystackAmountNGN}`);
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'FAILED', metadata: { ...data, _mismatchFlag: true } }
        });
        return { message: 'Amount mismatch — flagged for manual review' };
      }

      await this.prisma.$transaction(async (tx) => {
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

        await tx.order.update({
          where: { id: payment.orderId },
          data: { status: 'CONFIRMED' }
        });

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

        const order = await tx.order.findUnique({
          where: { id: payment.orderId },
          include: {
            user: { select: { email: true, firstName: true } },
            items: true,
          }
        });

        if (order) {
          this.emailService.sendOrderConfirmation(
            order.user.email,
            order.orderNumber,
            order.items,
            Number(payment.amount),
          ).catch((err) => console.error('Failed to send order confirmation email:', err));

          const vendorIds = [...new Set(order.items.map(i => i.vendorId))];
          for (const vendorId of vendorIds) {
            const vendor = await tx.vendor.findUnique({
              where: { id: vendorId },
              select: { storeName: true, user: { select: { email: true } } },
            });
            if (vendor) {
              const vendorItem = order.items.find(i => i.vendorId === vendorId)!;
              this.emailService.sendVendorNewOrderNotification(
                vendor.user.email,
                vendor.storeName,
                vendorItem,
              ).catch((err) => console.error('Failed to send vendor notification:', err));
            }
          }
        }
      });

      return { message: 'Processed successfully' };
    }

    return { message: 'Event ignored' };
  }
}
