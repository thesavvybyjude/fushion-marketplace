'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ProductCard } from '@/components/ui';

const MOCK_FEATURED = [
  {
    id: 'f1',
    name: 'Handcrafted Leather Tote',
    slug: 'leather-tote',
    price: 65000,
    vendorName: 'Lagos Artisans',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=500&auto=format&fit=crop',
    rating: 5.0,
  },
  {
    id: 'f2',
    name: 'Organic Shea Butter Set',
    slug: 'shea-butter-set',
    price: 15000,
    vendorName: 'Naturals By Ngozi',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=500&auto=format&fit=crop',
    rating: 4.8,
  }
];

export default function FeaturedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-20 w-full">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="px-4 py-1.5 bg-gold-dust text-coal rounded-full text-sm font-bold tracking-wider mb-4 uppercase">Editor's Pick</span>
          <h1 className="text-3xl md:text-5xl font-black text-coal mb-4">Featured Collection</h1>
          <p className="text-lg text-coal/60 max-w-2xl">
            Discover our handpicked selection of premium, highly-rated products from top-tier Nigerian vendors.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {MOCK_FEATURED.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              vendorName={product.vendorName}
              image={product.image}
              rating={product.rating}
            />
          ))}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
