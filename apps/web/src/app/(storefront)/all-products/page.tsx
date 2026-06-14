'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ProductCard } from '@/components/ui';

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
  },
  {
    id: '3',
    name: 'Aiye Leather Shoes',
    slug: 'aiye-leather-shoes',
    price: 45000,
    vendorName: 'Shoe Maker',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500&auto=format&fit=crop',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Shea Butter Lotion',
    slug: 'shea-butter-lotion',
    price: 5000,
    vendorName: 'Naturals By Ngozi',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop',
    rating: 4.7,
  }
];

export default function AllProductsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full flex flex-col md:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-coal/5 sticky top-24">
            <h3 className="font-bold text-coal mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-coal mb-2">Price Range</h4>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" className="w-full p-2 border rounded-lg text-sm" />
                  <span>-</span>
                  <input type="number" placeholder="Max" className="w-full p-2 border rounded-lg text-sm" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-coal">All Products</h1>
            <select className="bg-white border border-coal/10 rounded-lg px-3 py-2 text-sm text-coal outline-none">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
