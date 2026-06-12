'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button, ProductCard } from '@/components/ui';

// Mock data for Phase 2 UI
const MOCK_PRODUCTS = Array(8).fill(null).map((_, i) => ({
  id: `prod-${i}`,
  name: `Sample Product ${i + 1}`,
  slug: `sample-product-${i + 1}`,
  price: 15000 + (i * 2000),
  vendorName: i % 2 === 0 ? 'Lagos Gadgets' : 'Fashion Hub',
  image: `https://images.unsplash.com/photo-${1500000000000 + i}?q=80&w=500&auto=format&fit=crop`,
  rating: 4.0 + (i % 10) / 10,
}));

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products] = useState(MOCK_PRODUCTS);
  
  // Format slug to readable name
  const categoryName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <nav className="text-sm text-coal/60 mb-2">
              <a href="/" className="hover:text-ember">Home</a> &rsaquo; <span>Categories</span> &rsaquo; <span className="text-coal font-bold">{categoryName}</span>
            </nav>
            <h1 className="text-3xl font-black text-coal">{categoryName}</h1>
            <p className="text-coal/60 mt-1">Showing {products.length} products</p>
          </div>
          
          <div className="flex gap-2">
            <select className="bg-white border border-coal/10 rounded-lg px-4 py-2 text-sm text-coal outline-none focus:border-ember">
              <option>Sort by: Popular</option>
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Price (High to Low)</option>
              <option>Sort by: Newest</option>
            </select>
            <Button variant="secondary" className="md:hidden">Filters</Button>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block w-64 shrink-0 space-y-6 bg-white p-6 rounded-2xl border border-coal/5">
            <div>
              <h3 className="font-bold text-coal mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="Min" className="w-full bg-paper border border-coal/10 rounded px-2 py-1 text-sm outline-none focus:border-ember" />
                <span>-</span>
                <input type="number" placeholder="Max" className="w-full bg-paper border border-coal/10 rounded px-2 py-1 text-sm outline-none focus:border-ember" />
              </div>
            </div>
            
            <div className="border-t border-coal/10 pt-6">
              <h3 className="font-bold text-coal mb-3">Brands / Vendors</h3>
              <div className="space-y-2">
                {['Lagos Gadgets', 'Fashion Hub', 'Naija Stores'].map(vendor => (
                  <label key={vendor} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-ember focus:ring-ember bg-paper border-coal/20" />
                    <span className="text-sm text-coal/80">{vendor}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="border-t border-coal/10 pt-6">
              <h3 className="font-bold text-coal mb-3">Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rating" className="text-ember focus:ring-ember bg-paper border-coal/20" />
                    <span className="text-sm text-coal/80">{rating} Stars & Up</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  vendorName={product.vendorName}
                  imageUrl={product.image}
                  rating={product.rating}
                />
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <Button variant="secondary" size="lg" className="w-full max-w-xs">Load More</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
