'use client';

import { ReactNode } from 'react';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-paper">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-coal/10 shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-coal/10">
          <a href="/vendor/dashboard" className="text-xl font-black text-coal flex items-center gap-2 tracking-tight">
            FUSHION <span className="text-market-green text-xs tracking-widest bg-market-green/10 px-2 py-0.5 rounded">VENDOR</span>
          </a>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/vendor/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-coal/5 text-coal transition-colors">
            📊 Dashboard
          </a>
          <a href="/vendor/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-coal/5 text-coal transition-colors">
            📦 My Products
          </a>
          <a href="/vendor/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-coal/5 text-coal transition-colors">
            🛍️ Orders to Fulfill
          </a>
          <a href="/vendor/payouts" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-coal/5 text-coal transition-colors">
            💸 Earnings & Payouts
          </a>
          <a href="/vendor/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-coal/5 text-coal transition-colors">
            ⚙️ Store Settings
          </a>
        </nav>
        <div className="p-4 border-t border-coal/10">
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-coal/60 hover:text-coal hover:bg-coal/5 transition-colors">
            ← Back to Storefront
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white text-coal p-4 flex justify-between items-center sticky top-0 z-30 border-b border-coal/10">
          <span className="font-black flex items-center gap-2">
            FUSHION <span className="text-market-green text-xs bg-market-green/10 px-2 py-0.5 rounded">VENDOR</span>
          </span>
        </header>
        
        <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
