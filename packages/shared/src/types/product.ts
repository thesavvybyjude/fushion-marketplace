import type { ProductStatus } from '../constants/index.js';

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice: number | null;
  currency: string;
  sku: string | null;
  status: ProductStatus;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  totalSold: number;
  minOrderQty: number;
  maxOrderQty: number | null;
  tags: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  vendor: {
    id: string;
    storeName: string;
    storeSlug: string;
    avgRating: number;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string | null;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  altText: string | null;
  sortOrder: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  compareAtPrice: number | null;
  currency: string;
  status: ProductStatus;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  totalSold: number;
  primaryImage: string | null;
  vendor: {
    storeName: string;
    storeSlug: string;
  };
  category: {
    name: string;
    slug: string;
  };
}
