// ─── Fushion Shared Constants ────────────────────────────

// ─── Roles ───────────────────────────────────────────────
export const ROLES = {
  BUYER: 'BUYER',
  VENDOR: 'VENDOR',
  ADMIN: 'ADMIN',
  B2B_BUYER: 'B2B_BUYER',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// ─── Product Status ──────────────────────────────────────
export const PRODUCT_STATUSES = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ProductStatus = (typeof PRODUCT_STATUSES)[keyof typeof PRODUCT_STATUSES];

// ─── Order Status ────────────────────────────────────────
export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

// ─── Payment Status ──────────────────────────────────────
export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];

// ─── Vendor Status ───────────────────────────────────────
export const VENDOR_STATUSES = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type VendorStatus = (typeof VENDOR_STATUSES)[keyof typeof VENDOR_STATUSES];

// ─── Payout Status ───────────────────────────────────────
export const PAYOUT_STATUSES = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type PayoutStatus = (typeof PAYOUT_STATUSES)[keyof typeof PAYOUT_STATUSES];

// ─── Pagination ──────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ─── Currency ────────────────────────────────────────────
export const CURRENCIES = {
  NGN: 'NGN',
  GHS: 'GHS',
  XOF: 'XOF',
} as const;

export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES];

export const DEFAULT_CURRENCY = CURRENCIES.NGN;

// ─── Brand Colors ────────────────────────────────────────
export const BRAND_COLORS = {
  EMBER: '#E8642A',
  COAL: '#1A0E08',
  MARKET_GREEN: '#2C5F4A',
  GOLD_DUST: '#C4A35A',
  PAPER: '#F9F7F3',
} as const;

// ─── Payment Channels ───────────────────────────────────
export const PAYMENT_CHANNELS = {
  MOBILE_MONEY: 'mobile_money',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
  USSD: 'ussd',
} as const;

// ─── Nigerian States ────────────────────────────────────
export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
] as const;
