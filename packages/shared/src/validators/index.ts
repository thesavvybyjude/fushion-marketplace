import { z } from 'zod';
import { NIGERIAN_STATES } from '../constants/index.js';

// ─── Auth Validators ─────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Vendor Validators ───────────────────────────────────

export const vendorOnboardingStep1Schema = z.object({
  storeName: z
    .string()
    .min(3, 'Store name must be at least 3 characters')
    .max(50, 'Store name must be at most 50 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must be at most 500 characters'),
});

export const vendorOnboardingStep2Schema = z.object({
  categoryIds: z
    .array(z.string().uuid())
    .min(1, 'Select at least one category')
    .max(5, 'Select at most 5 categories'),
});

export const vendorOnboardingStep3Schema = z.object({
  phone: z.string().min(10, 'Enter a valid phone number').max(15),
  whatsapp: z.string().min(10).max(15).optional(),
});

export const vendorOnboardingStep4Schema = z.object({
  bankName: z.string().min(2, 'Bank name is required'),
  bankAccountNumber: z
    .string()
    .regex(/^\d{10}$/, 'Account number must be exactly 10 digits'),
  bankAccountName: z.string().min(3, 'Account name is required'),
  bankCode: z.string().min(3, 'Bank code is required'),
});

export const vendorOnboardingSchema = vendorOnboardingStep1Schema
  .merge(vendorOnboardingStep2Schema)
  .merge(vendorOnboardingStep3Schema)
  .merge(vendorOnboardingStep4Schema);

// ─── Product Validators ──────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(200),
  description: z.string().min(20, 'Description must be at least 20 characters').max(5000),
  categoryId: z.string().uuid('Invalid category'),
  basePrice: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional().nullable(),
  sku: z.string().max(50).optional().nullable(),
  minOrderQty: z.number().int().positive().default(1),
  maxOrderQty: z.number().int().positive().optional().nullable(),
  tags: z.array(z.string().max(50)).max(10).default([]),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        sku: z.string().max(50).optional().nullable(),
        price: z.number().positive(),
        stock: z.number().int().min(0),
        attributes: z.record(z.string()),
      }),
    )
    .optional()
    .default([]),
});

export const updateProductSchema = createProductSchema.partial();

// ─── Address Validators ──────────────────────────────────

export const addressSchema = z.object({
  label: z.enum(['Home', 'Work', 'Other']).default('Home'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().min(10).max(15),
  address1: z.string().min(5, 'Address is too short').max(200),
  address2: z.string().max(200).optional().nullable(),
  city: z.string().min(2).max(100),
  state: z.enum(NIGERIAN_STATES),
  country: z.string().default('Nigeria'),
  isDefault: z.boolean().default(false),
});

// ─── Pagination Validators ───────────────────────────────

export const paginationSchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ─── Export inferred types ───────────────────────────────
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VendorOnboardingInput = z.infer<typeof vendorOnboardingSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
