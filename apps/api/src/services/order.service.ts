import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

export class OrderService {
  constructor(private prisma: PrismaClient) {}

  async checkout(userId: string, items: any[], addressData: any) {
    if (!items || items.length === 0) {
      throw Object.assign(new Error('Cart is empty'), {
        statusCode: 400,
        code: 'EMPTY_CART',
      });
    }

    return this.prisma.$transaction(async (tx) => {
      let address = null;
      if (addressData.id) {
        address = await tx.address.findFirst({
          where: { id: addressData.id, userId }
        });
        if (!address) throw Object.assign(new Error('Address not found'), { statusCode: 404, code: 'ADDRESS_NOT_FOUND' });
      } else {
        address = await tx.address.create({
          data: {
            userId,
            firstName: addressData.firstName,
            lastName: addressData.lastName,
            phone: addressData.phone,
            address1: addressData.address1,
            address2: addressData.address2,
            city: addressData.city,
            state: addressData.state,
          }
        });
      }

      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { vendor: true, images: true }
        });

        if (!product) throw Object.assign(new Error(`Product ${item.productId} not found`), { statusCode: 404, code: 'PRODUCT_NOT_FOUND' });
        if (product.status !== 'ACTIVE') throw Object.assign(new Error(`Product ${product.name} is not available for purchase`), { statusCode: 400, code: 'PRODUCT_NOT_ACTIVE' });

        let unitPrice = Number(product.basePrice);
        let variant = null;

        if (item.variantId) {
          variant = await tx.productVariant.findUnique({
            where: { id: item.variantId, isActive: true },
          });

          if (!variant) throw Object.assign(new Error(`Variant ${item.variantId} not found`), { statusCode: 404, code: 'VARIANT_NOT_FOUND' });

          if (variant.stock < item.quantity) {
            throw Object.assign(new Error(`Insufficient stock for ${product.name}. Available: ${variant.stock}`), {
              statusCode: 409,
              code: 'INSUFFICIENT_STOCK',
            });
          }

          unitPrice = Number(variant.price);
        }

        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        const commissionRate = product.vendor.commissionRate;
        const commissionAmount = totalPrice * commissionRate;
        const vendorAmount = totalPrice - commissionAmount;

        const productSnapshot = {
          name: product.name,
          image: product.images[0]?.url || null,
          variantName: variant?.name || null,
        };

        orderItemsData.push({
          productId: product.id,
          variantId: variant?.id || null,
          vendorId: product.vendorId,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
          commissionRate,
          commissionAmount,
          vendorAmount,
          productSnapshot,
        });
      }

      const deliveryFee = Number(process.env.DELIVERY_FEE ?? '2500');
      const totalAmount = subtotal + deliveryFee;

      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      let orderNumber = '';
      let attempts = 0;
      while (attempts < 5) {
        const randomStr = randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
        orderNumber = `FSH-${dateStr}-${randomStr}`;
        const existing = await tx.order.findUnique({ where: { orderNumber } });
        if (!existing) break;
        attempts++;
      }
      if (attempts >= 5) throw new Error('Failed to generate unique order number');

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: address.id,
          subtotal,
          deliveryFee,
          totalAmount,
          items: {
            create: orderItemsData
          }
        }
      });

      const paystackRef = `REF-${randomUUID()}`;

      await tx.payment.create({
        data: {
          orderId: order.id,
          paystackRef,
          amount: totalAmount,
          idempotencyKey: randomUUID(),
        }
      });

      for (const item of items) {
        if (item.variantId) {
          const result = await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });

          if (result.count === 0) {
            throw Object.assign(
              new Error(`Insufficient stock for variant ${item.variantId} — sold out`),
              { statusCode: 409, code: 'INSUFFICIENT_STOCK' },
            );
          }
        }
      }

      return {
        order,
        reference: paystackRef,
      };
    });
  }
}
