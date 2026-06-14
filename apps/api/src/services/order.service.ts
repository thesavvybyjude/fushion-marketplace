import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

export class OrderService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Initializes an order from cart items.
   * Runs in a Prisma transaction to guarantee atomic creation of the order, items, and pending payment.
   */
  async checkout(userId: string, items: any[], addressData: any) {
    if (!items || items.length === 0) {
      throw new Error('Cart is empty');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create or get delivery address
      let address = null;
      if (addressData.id) {
        address = await tx.address.findFirst({
          where: { id: addressData.id, userId }
        });
        if (!address) throw new Error('Address not found');
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

      // 2. Validate items, check stock, calculate snapshot prices and commissions
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { vendor: true, images: true }
        });

        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.status !== 'ACTIVE') throw new Error(`Product ${product.name} is not available for purchase`);

        let unitPrice = Number(product.basePrice);
        let variant = null;

        if (item.variantId) {
          variant = await tx.productVariant.findUnique({
            where: { id: item.variantId }
          });
          if (!variant) throw new Error(`Variant ${item.variantId} not found`);
          if (variant.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);
          unitPrice = Number(variant.price);
        }

        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        // Commission calculation (snapshot vendor's current commission rate)
        const commissionRate = product.vendor.commissionRate;
        const commissionAmount = totalPrice * commissionRate;
        const vendorAmount = totalPrice - commissionAmount;

        // Snapshot of product details so order history doesn't break if product changes
        const productSnapshot = {
          name: product.name,
          image: product.images[0]?.url,
          variantName: variant?.name,
        };

        orderItemsData.push({
          productId: product.id,
          variantId: variant?.id,
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

      const deliveryFee = 2500; // Flat fee for MVP
      const totalAmount = subtotal + deliveryFee;

      // 3. Generate human-readable order number FSH-YYYYMMDD-XXXXXXXX with collision retry
      const dateStr = new Date().toISOString().slice(0,10).replace(/-/g,'');
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

      // 4. Create Order + OrderItems
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

      // 5. Initialize Payment (Pending)
      const paystackRef = `REF-${randomUUID()}`; // Generate a unique reference for Paystack
      
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          paystackRef,
          amount: totalAmount,
          idempotencyKey: randomUUID(),
        }
      });

      return {
        order,
        reference: paystackRef,
      };
    });
  }
}
