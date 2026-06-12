import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── 1. Create admin user ─────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@Fushion2026', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fushion.dev' },
    update: {},
    create: {
      email: 'admin@fushion.dev',
      passwordHash: adminPassword,
      firstName: 'Fushion',
      lastName: 'Admin',
      role: 'ADMIN',
      emailVerified: true,
    },
  });
  console.log(`✅ Admin user: ${admin.email} (${admin.id})`);

  // ─── 2. Create categories ─────────────────────────────
  const categoryData = [
    { name: 'Phones & Tablets', slug: 'phones-tablets', description: 'Smartphones, tablets, and accessories', sortOrder: 1 },
    { name: 'Electronics', slug: 'electronics', description: 'TVs, audio, cameras, and electronic accessories', sortOrder: 2 },
    { name: 'Computing', slug: 'computing', description: 'Laptops, desktops, printers, and computing accessories', sortOrder: 3 },
    { name: 'Fashion', slug: 'fashion', description: 'Clothing, shoes, bags, and accessories for men and women', sortOrder: 4 },
    { name: 'Health & Beauty', slug: 'health-beauty', description: 'Skincare, haircare, fragrance, and personal care', sortOrder: 5 },
    { name: 'Home & Living', slug: 'home-living', description: 'Furniture, kitchen, bedding, and home décor', sortOrder: 6 },
    { name: 'Baby & Kids', slug: 'baby-kids', description: 'Baby clothing, toys, feeding, and kids essentials', sortOrder: 7 },
    { name: 'Food & Groceries', slug: 'food-groceries', description: 'Packaged food, beverages, cooking ingredients, and snacks', sortOrder: 8 },
  ];

  const categories = [];
  for (const cat of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(category);
    console.log(`✅ Category: ${category.name} (${category.id})`);
  }

  // ─── 3. Create test vendor (dev only) ──────────────────
  if (process.env.NODE_ENV !== 'production') {
    const vendorPassword = await bcrypt.hash('Vendor@Test2026', 12);
    const vendorUser = await prisma.user.upsert({
      where: { email: 'vendor@fushion.dev' },
      update: {},
      create: {
        email: 'vendor@fushion.dev',
        passwordHash: vendorPassword,
        firstName: 'Test',
        lastName: 'Vendor',
        role: 'VENDOR',
        emailVerified: true,
      },
    });

    const vendor = await prisma.vendor.upsert({
      where: { userId: vendorUser.id },
      update: {},
      create: {
        userId: vendorUser.id,
        storeName: 'Lagos Electronics Hub',
        storeSlug: 'lagos-electronics-hub',
        description: 'Your one-stop shop for quality electronics in Lagos. Fast delivery, genuine products.',
        phone: '+2348012345678',
        whatsapp: '+2348012345678',
        status: 'ACTIVE',
        commissionRate: 0.10,
        bankName: 'Access Bank',
        bankAccountNumber: '0123456789',
        bankAccountName: 'Test Vendor',
        bankCode: '044',
        vendorCategories: {
          create: [
            { categoryId: categories[0].id }, // Phones & Tablets
            { categoryId: categories[1].id }, // Electronics
          ],
        },
      },
    });
    console.log(`✅ Test vendor: ${vendor.storeName} (${vendor.id})`);

    // ─── 4. Create sample products (dev only) ────────────
    const sampleProducts = [
      {
        name: 'Samsung Galaxy A15 — 128GB',
        slug: 'samsung-galaxy-a15-128gb',
        description: 'Samsung Galaxy A15 smartphone with 128GB storage, 6GB RAM, 6.5-inch Super AMOLED display. Dual SIM, 5000mAh battery. Official Samsung Nigeria warranty.',
        basePrice: 145000,
        categoryId: categories[0].id,
        tags: ['samsung', 'smartphone', 'galaxy', 'android'],
        status: 'ACTIVE' as const,
      },
      {
        name: 'Infinix Hot 40 Pro — 256GB',
        slug: 'infinix-hot-40-pro-256gb',
        description: 'Infinix Hot 40 Pro with 256GB storage, 8GB RAM, MediaTek Helio G99 processor. 108MP camera, 5000mAh battery with 33W fast charging.',
        basePrice: 165000,
        compareAtPrice: 189000,
        categoryId: categories[0].id,
        tags: ['infinix', 'smartphone', 'hot-40', 'android'],
        status: 'ACTIVE' as const,
      },
      {
        name: 'Oraimo FreePods 4 — True Wireless Earbuds',
        slug: 'oraimo-freepods-4-wireless-earbuds',
        description: 'Oraimo FreePods 4 with Active Noise Cancellation, 30-hour battery life, IPX5 water resistance. Crystal clear calls with 4 microphones.',
        basePrice: 15500,
        compareAtPrice: 22000,
        categoryId: categories[1].id,
        tags: ['oraimo', 'earbuds', 'wireless', 'audio'],
        status: 'ACTIVE' as const,
      },
      {
        name: 'HP Laptop 15 — Intel Core i5, 8GB RAM, 512GB SSD',
        slug: 'hp-laptop-15-i5-8gb-512gb',
        description: 'HP Laptop 15 with 12th Gen Intel Core i5-1235U, 8GB DDR4 RAM, 512GB NVMe SSD. 15.6-inch Full HD display. Windows 11 Home.',
        basePrice: 485000,
        categoryId: categories[2].id,
        tags: ['hp', 'laptop', 'intel', 'computing'],
        status: 'ACTIVE' as const,
      },
      {
        name: 'Ankara Print Dress — Women\'s Fashion',
        slug: 'ankara-print-dress-womens',
        description: 'Beautiful Ankara print dress made with premium quality fabric. Available in multiple sizes. Made in Nigeria by local artisans.',
        basePrice: 12000,
        compareAtPrice: 18000,
        categoryId: categories[3].id,
        tags: ['ankara', 'dress', 'fashion', 'women', 'made-in-nigeria'],
        status: 'ACTIVE' as const,
      },
    ];

    for (const productData of sampleProducts) {
      const product = await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: {
          vendorId: vendor.id,
          ...productData,
        },
      });
      console.log(`✅ Product: ${product.name} — ₦${Number(product.basePrice).toLocaleString()}`);
    }

    // Create test buyer
    const buyerPassword = await bcrypt.hash('Buyer@Test2026', 12);
    const buyer = await prisma.user.upsert({
      where: { email: 'buyer@fushion.dev' },
      update: {},
      create: {
        email: 'buyer@fushion.dev',
        passwordHash: buyerPassword,
        firstName: 'Test',
        lastName: 'Buyer',
        role: 'BUYER',
        emailVerified: true,
      },
    });
    console.log(`✅ Test buyer: ${buyer.email} (${buyer.id})`);
  }

  console.log('\n🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
