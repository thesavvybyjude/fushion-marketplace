import type { PrismaClient } from '@prisma/client';

export class CategoryService {
  constructor(private prisma: PrismaClient) {}

  async getAll() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            products: { where: { status: 'ACTIVE', deletedAt: null } },
          },
        },
      },
    });

    // Build tree structure
    const categoryMap = new Map<string, any>();
    const roots: any[] = [];

    for (const cat of categories) {
      categoryMap.set(cat.id, {
        ...cat,
        productCount: cat._count.products,
        _count: undefined,
        children: [],
      });
    }

    for (const cat of categories) {
      const node = categoryMap.get(cat.id)!;
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async getBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            products: { where: { status: 'ACTIVE', deletedAt: null } },
          },
        },
      },
    });

    if (!category) {
      throw Object.assign(new Error('Category not found'), {
        statusCode: 404,
        code: 'CATEGORY_NOT_FOUND',
      });
    }

    return {
      ...category,
      productCount: category._count.products,
      _count: undefined,
    };
  }
}
