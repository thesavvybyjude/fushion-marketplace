import type { PrismaClient, Prisma } from '@prisma/client';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 120);
}

export class ProductService {
  constructor(private prisma: PrismaClient) {}

  async create(
    vendorId: string,
    data: {
      name: string;
      description: string;
      categoryId: string;
      basePrice: number;
      compareAtPrice?: number | null;
      sku?: string | null;
      minOrderQty?: number;
      maxOrderQty?: number | null;
      tags?: string[];
      variants?: Array<{
        name: string;
        sku?: string | null;
        price: number;
        stock: number;
        attributes: Record<string, string>;
      }>;
    },
  ) {
    // Validate category exists
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId, isActive: true },
    });

    if (!category) {
      throw Object.assign(new Error('Invalid category'), {
        statusCode: 400,
        code: 'INVALID_CATEGORY',
      });
    }

    // Generate unique slug
    let slug = slugify(data.name);
    const slugExists = await this.prisma.product.findUnique({ where: { slug } });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const product = await this.prisma.product.create({
      data: {
        vendorId,
        categoryId: data.categoryId,
        name: data.name,
        slug,
        description: data.description,
        basePrice: data.basePrice,
        compareAtPrice: data.compareAtPrice ?? null,
        sku: data.sku ?? null,
        minOrderQty: data.minOrderQty ?? 1,
        maxOrderQty: data.maxOrderQty ?? null,
        tags: data.tags ?? [],
        status: 'PENDING_APPROVAL',
        variants: data.variants?.length
          ? {
              create: data.variants.map((v) => ({
                name: v.name,
                sku: v.sku ?? null,
                price: v.price,
                stock: v.stock,
                attributes: v.attributes,
              })),
            }
          : undefined,
      },
      include: {
        variants: true,
        images: true,
        category: { select: { id: true, name: true, slug: true } },
        vendor: { select: { id: true, storeName: true, storeSlug: true, avgRating: true } },
      },
    });

    return product;
  }

  async list(params: {
    cursor?: string;
    limit?: number;
    categoryId?: string;
    vendorId?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const limit = Math.min(params.limit || 20, 100);

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      ...(params.status ? { status: params.status as any } : { status: 'ACTIVE' }),
      ...(params.categoryId && { categoryId: params.categoryId }),
      ...(params.vendorId && { vendorId: params.vendorId }),
      ...(params.minPrice !== undefined || params.maxPrice !== undefined
        ? {
            basePrice: {
              ...(params.minPrice !== undefined && { gte: params.minPrice }),
              ...(params.maxPrice !== undefined && { lte: params.maxPrice }),
            },
          }
        : {}),
      ...(params.search && {
        OR: [
          { name: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
          { tags: { has: params.search.toLowerCase() } },
        ],
      }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
      switch (params.sortBy) {
        case 'price':
          return { basePrice: params.sortOrder || 'asc' };
        case 'rating':
          return { avgRating: params.sortOrder || 'desc' };
        case 'sold':
          return { totalSold: params.sortOrder || 'desc' };
        case 'name':
          return { name: params.sortOrder || 'asc' };
        default:
          return { createdAt: params.sortOrder || 'desc' };
      }
    })();

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      take: limit + 1, // Fetch one extra to check if there's a next page
      ...(params.cursor && {
        skip: 1,
        cursor: { id: params.cursor },
      }),
      select: {
        id: true,
        name: true,
        slug: true,
        basePrice: true,
        compareAtPrice: true,
        currency: true,
        status: true,
        isFeatured: true,
        avgRating: true,
        reviewCount: true,
        totalSold: true,
        createdAt: true,
        images: {
          select: { url: true },
          orderBy: { sortOrder: 'asc' },
          take: 1,
        },
        vendor: {
          select: { storeName: true, storeSlug: true },
        },
        category: {
          select: { name: true, slug: true },
        },
      },
    });

    const hasMore = products.length > limit;
    const items = hasMore ? products.slice(0, limit) : products;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
      data: items.map((p) => ({
        ...p,
        basePrice: Number(p.basePrice),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        primaryImage: p.images[0]?.url || null,
        images: undefined,
      })),
      pagination: {
        cursor: nextCursor,
        hasMore,
      },
    };
  }

  async getById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId, deletedAt: null },
      include: {
        variants: { where: { isActive: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        vendor: {
          select: { id: true, storeName: true, storeSlug: true, avgRating: true, phone: true, whatsapp: true },
        },
      },
    });

    if (!product) {
      throw Object.assign(new Error('Product not found'), {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    return {
      ...product,
      basePrice: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      variants: product.variants.map((v) => ({
        ...v,
        price: Number(v.price),
      })),
    };
  }

  async getBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug, deletedAt: null },
      include: {
        variants: { where: { isActive: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        vendor: {
          select: { id: true, storeName: true, storeSlug: true, avgRating: true, phone: true, whatsapp: true },
        },
      },
    });

    if (!product) {
      throw Object.assign(new Error('Product not found'), {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    return {
      ...product,
      basePrice: Number(product.basePrice),
      compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
      variants: product.variants.map((v) => ({
        ...v,
        price: Number(v.price),
      })),
    };
  }

  async update(
    productId: string,
    vendorId: string,
    data: {
      name?: string;
      description?: string;
      categoryId?: string;
      basePrice?: number;
      compareAtPrice?: number | null;
      sku?: string | null;
      minOrderQty?: number;
      maxOrderQty?: number | null;
      tags?: string[];
    },
  ) {
    // Verify product belongs to vendor
    const product = await this.prisma.product.findUnique({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw Object.assign(new Error('Product not found'), {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    if (product.vendorId !== vendorId) {
      throw Object.assign(new Error('You can only update your own products'), {
        statusCode: 403,
        code: 'FORBIDDEN',
      });
    }

    // If category is changing, validate it exists
    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId, isActive: true },
      });
      if (!category) {
        throw Object.assign(new Error('Invalid category'), {
          statusCode: 400,
          code: 'INVALID_CATEGORY',
        });
      }
    }

    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: {
        ...(data.name && { name: data.name, slug: slugify(data.name) }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
        ...(data.compareAtPrice !== undefined && { compareAtPrice: data.compareAtPrice }),
        ...(data.sku !== undefined && { sku: data.sku }),
        ...(data.minOrderQty !== undefined && { minOrderQty: data.minOrderQty }),
        ...(data.maxOrderQty !== undefined && { maxOrderQty: data.maxOrderQty }),
        ...(data.tags && { tags: data.tags }),
      },
      include: {
        variants: true,
        images: { orderBy: { sortOrder: 'asc' } },
        category: { select: { id: true, name: true, slug: true } },
        vendor: { select: { id: true, storeName: true, storeSlug: true, avgRating: true } },
      },
    });

    return {
      ...updated,
      basePrice: Number(updated.basePrice),
      compareAtPrice: updated.compareAtPrice ? Number(updated.compareAtPrice) : null,
    };
  }

  async softDelete(productId: string, vendorId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw Object.assign(new Error('Product not found'), {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    if (product.vendorId !== vendorId) {
      throw Object.assign(new Error('You can only delete your own products'), {
        statusCode: 403,
        code: 'FORBIDDEN',
      });
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date(), status: 'ARCHIVED' },
    });

    return { message: 'Product deleted successfully' };
  }

  async addImages(
    productId: string,
    vendorId: string,
    images: Array<{ url: string; publicId: string; altText?: string }>,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId, deletedAt: null },
    });

    if (!product || product.vendorId !== vendorId) {
      throw Object.assign(new Error('Product not found or unauthorized'), {
        statusCode: 404,
        code: 'PRODUCT_NOT_FOUND',
      });
    }

    const currentImageCount = await this.prisma.productImage.count({
      where: { productId },
    });

    const created = await this.prisma.productImage.createMany({
      data: images.map((img, idx) => ({
        productId,
        url: img.url,
        publicId: img.publicId,
        altText: img.altText || null,
        sortOrder: currentImageCount + idx,
      })),
    });

    return created;
  }
}
