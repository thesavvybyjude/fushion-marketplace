import Typesense from 'typesense';

const TYPESENSE_HOST = process.env.TYPESENSE_HOST || 'localhost';
const TYPESENSE_PORT = process.env.TYPESENSE_PORT ? parseInt(process.env.TYPESENSE_PORT) : 8108;
const TYPESENSE_PROTOCOL = process.env.TYPESENSE_PROTOCOL || 'http';
const TYPESENSE_API_KEY = process.env.TYPESENSE_API_KEY || 'xyz';

export class SearchService {
  private client: Typesense.Client;

  constructor() {
    this.client = new Typesense.Client({
      nodes: [
        {
          host: TYPESENSE_HOST,
          port: TYPESENSE_PORT,
          protocol: TYPESENSE_PROTOCOL,
        },
      ],
      apiKey: TYPESENSE_API_KEY,
      connectionTimeoutSeconds: 2,
    });
  }

  async initCollection() {
    const schema = {
      name: 'products',
      fields: [
        { name: 'id', type: 'string' as const },
        { name: 'name', type: 'string' as const },
        { name: 'slug', type: 'string' as const },
        { name: 'description', type: 'string' as const },
        { name: 'vendorId', type: 'string' as const, facet: true },
        { name: 'vendorName', type: 'string' as const, facet: true },
        { name: 'categoryId', type: 'string' as const, facet: true },
        { name: 'categoryName', type: 'string' as const, facet: true },
        { name: 'basePrice', type: 'float' as const, facet: true },
        { name: 'avgRating', type: 'float' as const, facet: true },
        { name: 'totalSold', type: 'int32' as const },
        { name: 'tags', type: 'string[]' as const, facet: true, optional: true },
        { name: 'primaryImage', type: 'string' as const, optional: true },
        { name: 'status', type: 'string' as const, facet: true },
        { name: 'createdAt', type: 'int64' as const },
      ],
      default_sorting_field: 'createdAt',
    };

    try {
      await this.client.collections('products').retrieve();
    } catch (error) {
      // Collection does not exist, create it
      await this.client.collections().create(schema);
    }
  }

  async indexProduct(product: any) {
    const document = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      vendorId: product.vendorId,
      vendorName: product.vendor.storeName,
      categoryId: product.categoryId,
      categoryName: product.category.name,
      basePrice: Number(product.basePrice),
      avgRating: product.avgRating,
      totalSold: product.totalSold,
      tags: product.tags,
      primaryImage: product.images?.[0]?.url,
      status: product.status,
      createdAt: Math.floor(product.createdAt.getTime() / 1000),
    };

    await this.client.collections('products').documents().upsert(document);
  }

  async deleteProduct(productId: string) {
    try {
      await this.client.collections('products').documents(productId).delete();
    } catch (error) {
      // Ignore if document not found
    }
  }

  async searchProducts(query: string, options?: any) {
    const searchParameters = {
      q: query,
      query_by: 'name,description,tags,vendorName,categoryName',
      ...options,
    };

    return this.client.collections('products').documents().search(searchParameters);
  }
}
