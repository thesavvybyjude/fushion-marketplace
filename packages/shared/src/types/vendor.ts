import type { VendorStatus } from '../constants/index.js';

export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  phone: string;
  whatsapp: string | null;
  status: VendorStatus;
  commissionRate: number;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  avgRating: number;
  totalSales: number;
  createdAt: string;
  updatedAt: string;
}

export interface VendorOnboarding {
  // Step 1: Store info
  storeName: string;
  description: string;
  // Step 2: Categories
  categoryIds: string[];
  // Step 3: Contact
  phone: string;
  whatsapp?: string;
  // Step 4: Bank details
  bankName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  bankCode: string;
}

export interface VendorPublicProfile {
  id: string;
  storeName: string;
  storeSlug: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  avgRating: number;
  totalSales: number;
  productCount: number;
}
