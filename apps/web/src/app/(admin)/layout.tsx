'use client';

import { ReactNode } from 'react';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-paper">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-coal text-white shrink-0 sticky top-0 h-screen">
        <div className="p-6 border-b border-white/10">
          <a href="/admin/dashboard" className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            FUSHION <span className="text-ember text-xs tracking-widest bg-white/10 px-2 py-0.5 rounded">ADMIN</span>
          </a>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            📊 Dashboard
          </a>
          <a href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            📦 Products Approval
          </a>
          <a href="/admin/vendors" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            🏪 Vendors
          </a>
          <a href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            🛍️ Orders
          </a>
          <a href="/admin/payouts" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors">
            💸 Payouts
          </a>
        </nav>
        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            ← Storefront
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-coal text-white p-4 flex justify-between items-center sticky top-0 z-30">
          <span className="font-black">FUSHION ADMIN</span>
        </header>
        
        <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
