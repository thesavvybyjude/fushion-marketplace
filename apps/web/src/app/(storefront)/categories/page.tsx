'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Laptop, Shirt, Home as HomeIcon, Sparkles } from 'lucide-react';

const MOCK_CATEGORIES = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: <Laptop size={32} strokeWidth={2} /> },
  { id: '2', name: 'Fashion', slug: 'fashion', icon: <Shirt size={32} strokeWidth={2} /> },
  { id: '3', name: 'Home & Living', slug: 'home', icon: <HomeIcon size={32} strokeWidth={2} /> },
  { id: '4', name: 'Health & Beauty', slug: 'health', icon: <Sparkles size={32} strokeWidth={2} /> },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-coal mb-8">All Categories</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOCK_CATEGORIES.map(category => (
            <a 
              key={category.id} 
              href={`/category/${category.slug}`} 
              className="bg-white p-6 rounded-2xl border border-coal/5 text-center hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform text-coal">
                {category.icon}
              </div>
              <h3 className="font-bold text-coal text-sm md:text-base">{category.name}</h3>
            </a>
          ))}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
