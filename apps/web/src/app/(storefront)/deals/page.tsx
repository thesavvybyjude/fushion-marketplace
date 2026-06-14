'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ProductCard } from '@/components/ui';

const MOCK_DEALS = [
  {
    id: 'd1',
    name: 'Smart TV 55" 4K',
    slug: 'smart-tv-55-4k',
    price: 450000,
    compareAtPrice: 600000,
    vendorName: 'Electro World',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=500&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: 'd2',
    name: 'Wireless Noise Cancelling Headphones',
    slug: 'wireless-headphones',
    price: 35000,
    compareAtPrice: 50000,
    vendorName: 'Audio Kings',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop',
    rating: 4.9,
  }
];

export default function DealsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-20 w-full">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="px-4 py-1.5 bg-ember text-white rounded-full text-sm font-bold tracking-wider mb-4 uppercase shadow-lg shadow-ember/20">Flash Sale</span>
          <h1 className="text-3xl md:text-5xl font-black text-coal mb-4">Today's Deals</h1>
          <p className="text-lg text-coal/60 max-w-2xl">
            Grab these limited-time offers before they're gone! Up to 50% off select products from premium verified vendors.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {MOCK_DEALS.map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
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
