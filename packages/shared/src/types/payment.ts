import type { PaymentStatus } from '../constants/index.js';

export interface Payment {
  id: string;
  orderId: string;
  paystackRef: string;
  paystackTxnId: string | null;
  amount: number;
  currency: string;
  channel: string | null;
  status: PaymentStatus;
  paidAt: string | null;
}
