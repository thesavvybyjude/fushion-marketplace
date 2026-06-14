'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ProductCard } from '@/components/ui';
import { Search } from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Infinix Zero 30 5G',
    slug: 'infinix-zero-30-5g',
    price: 350000,
    vendorName: 'Gadget Hub',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Ankara Print Maxi Dress',
    slug: 'ankara-print-maxi-dress',
    price: 25000,
    vendorName: 'Lagos Styles',
    image: 'https://images.unsplash.com/photo-1515347619362-717472ba89dd?q=80&w=500&auto=format&fit=crop',
    rating: 4.5,
  }
];

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands and categories..."
              className="w-full pl-12 pr-4 py-4 bg-white text-coal rounded-xl border border-coal/10 focus:outline-none focus:ring-2 focus:ring-ember/20 focus:border-ember transition-all shadow-sm"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-coal/40" size={24} strokeWidth={2} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-coal mb-6">
            {query ? `Search results for "${query}"` : 'Trending Searches'}
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {MOCK_PRODUCTS.map(product => (
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

          {MOCK_PRODUCTS.length === 0 && (
            <div className="text-center py-16">
              <p className="text-coal/60">No Products Found. Try adjusting your search query.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
