import type { PrismaClient } from '@prisma/client';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

export class VendorService {
  constructor(private prisma: PrismaClient) {}

  async onboard(
    userId: string,
    data: {
      storeName: string;
      description: string;
      categoryIds: string[];
      phone: string;
      whatsapp?: string;
      bankName: string;
      bankAccountNumber: string;
      bankAccountName: string;
      bankCode: string;
    },
  ) {
    // Check if user already has a vendor profile
    const existing = await this.prisma.vendor.findUnique({
      where: { userId },
    });

    if (existing) {
      throw Object.assign(new Error('You already have a vendor profile'), {
        statusCode: 409,
        code: 'VENDOR_EXISTS',
      });
    }

    // Check store name uniqueness
    const storeNameTaken = await this.prisma.vendor.findUnique({
      where: { storeName: data.storeName },
    });

    if (storeNameTaken) {
      throw Object.assign(new Error('This store name is already taken'), {
        statusCode: 409,
        code: 'STORE_NAME_TAKEN',
      });
    }

    // Generate unique slug
    let storeSlug = slugify(data.storeName);
    const slugExists = await this.prisma.vendor.findUnique({
      where: { storeSlug },
    });
    if (slugExists) {
      storeSlug = `${storeSlug}-${Date.now().toString(36)}`;
    }

    // Validate categories exist
    const categories = await this.prisma.category.findMany({
      where: { id: { in: data.categoryIds }, isActive: true },
    });

    if (categories.length !== data.categoryIds.length) {
      throw Object.assign(new Error('One or more selected categories are invalid'), {
        statusCode: 400,
        code: 'INVALID_CATEGORIES',
      });
    }

    // Create vendor + upgrade user role in a transaction
    const vendor = await this.prisma.$transaction(async (tx) => {
      const newVendor = await tx.vendor.create({
        data: {
          userId,
          storeName: data.storeName,
          storeSlug,
          description: data.description,
          phone: data.phone,
          whatsapp: data.whatsapp || null,
          bankName: data.bankName,
          bankAccountNumber: data.bankAccountNumber,
          bankAccountName: data.bankAccountName,
          bankCode: data.bankCode,
          vendorCategories: {
            create: data.categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
        include: {
          vendorCategories: {
            include: { category: true },
          },
        },
      });

      // Upgrade user role to VENDOR
      await tx.user.update({
        where: { id: userId },
        data: { role: 'VENDOR' },
      });

      return newVendor;
    });

    return vendor;
  }

  async getMyProfile(userId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { userId },
      include: {
        vendorCategories: {
          include: { category: true },
        },
        _count: {
          select: { products: true, orderItems: true },
        },
      },
    });

    if (!vendor) {
      throw Object.assign(new Error('Vendor profile not found'), {
        statusCode: 404,
        code: 'VENDOR_NOT_FOUND',
      });
    }

    return vendor;
  }

  async updateProfile(
    userId: string,
    data: {
      storeName?: string;
      description?: string;
      phone?: string;
      whatsapp?: string;
      logoUrl?: string;
      bannerUrl?: string;
    },
  ) {
    const vendor = await this.prisma.vendor.findUnique({ where: { userId } });

    if (!vendor) {
      throw Object.assign(new Error('Vendor profile not found'), {
        statusCode: 404,
        code: 'VENDOR_NOT_FOUND',
      });
    }

    // If store name is changing, check uniqueness
    if (data.storeName && data.storeName !== vendor.storeName) {
      const taken = await this.prisma.vendor.findUnique({
        where: { storeName: data.storeName },
      });
      if (taken) {
        throw Object.assign(new Error('This store name is already taken'), {
          statusCode: 409,
          code: 'STORE_NAME_TAKEN',
        });
      }
    }

    const updated = await this.prisma.vendor.update({
      where: { userId },
      data: {
        ...(data.storeName && {
          storeName: data.storeName,
          storeSlug: slugify(data.storeName),
        }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.phone && { phone: data.phone }),
        ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp || null }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.bannerUrl !== undefined && { bannerUrl: data.bannerUrl }),
      },
    });

    return updated;
  }

  async getPublicProfile(vendorId: string) {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id: vendorId, status: 'ACTIVE' },
      select: {
        id: true,
        storeName: true,
        storeSlug: true,
        description: true,
        logoUrl: true,
        bannerUrl: true,
        avgRating: true,
        totalSales: true,
        _count: {
          select: { products: { where: { status: 'ACTIVE', deletedAt: null } } },
        },
      },
    });

    if (!vendor) {
      throw Object.assign(new Error('Vendor not found'), {
        statusCode: 404,
        code: 'VENDOR_NOT_FOUND',
      });
    }

    return {
      ...vendor,
      productCount: vendor._count.products,
      _count: undefined,
    };
  }
}
