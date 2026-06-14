import { PrismaClient } from '@prisma/client';

export class PayoutService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Initializes a payout via Paystack Transfers API
   */
  async initiatePayout(vendorId: string, amount: number) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId }
    });

    if (!vendor) throw new Error('Vendor not found');
    if (!vendor.bankCode || !vendor.bankAccountNumber) {
      throw new Error('Vendor has not completed bank details onboarding');
    }

    const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    if (!SECRET_KEY) {
      throw new Error('Payout failed: Missing payment configuration');
    }

    // 1. Create Transfer Recipient
    const recipientRes = await fetch('https://api.paystack.co/transferrecipient', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'nuban',
        name: vendor.bankAccountName || vendor.storeName,
        account_number: vendor.bankAccountNumber,
        bank_code: vendor.bankCode,
        currency: 'NGN'
      })
    });

    const recipientData = await recipientRes.json();
    if (!recipientData.status) {
      throw new Error(`Failed to create recipient: ${recipientData.message}`);
    }

    const recipientCode = recipientData.data.recipient_code;

    // 2. Initiate Transfer
    const transferRes = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'balance',
        amount: amount * 100, // Paystack uses kobo
        recipient: recipientCode,
        reason: `Fushion Marketplace Payout - ${vendor.storeName}`
      })
    });

    const transferData = await transferRes.json();
    
    if (!transferData.status) {
      throw new Error(`Transfer failed: ${transferData.message}`);
    }

    // 3. Record Payout in DB
    const payout = await this.prisma.payout.create({
      data: {
        vendorId,
        amount,
        status: 'PROCESSING',
        paystackTransferId: transferData.data.transfer_code,
        bankName: vendor.bankName || 'Unknown Bank',
        accountNumber: vendor.bankAccountNumber,
        accountName: vendor.bankAccountName || vendor.storeName,
        note: transferData.message,
      }
    });

    return payout;
  }
}
