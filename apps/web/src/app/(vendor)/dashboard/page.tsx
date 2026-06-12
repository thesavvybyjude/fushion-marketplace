'use client';

import { useState } from 'react';
import { Card, Button } from '@/components/ui';

export default function VendorDashboardPage() {
  const [stats] = useState({
    revenue: 1250000,
    pendingOrders: 12,
    activeProducts: 45,
    rating: 4.8
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-coal">Vendor Dashboard</h1>
          <p className="text-coal/60">Welcome back to your store!</p>
        </div>
        <Button variant="secondary" className="hidden md:inline-flex">+ Add New Product</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card padding="md" className="border-l-4 border-l-ember">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Total Revenue</p>
          <h2 className="text-3xl font-black text-coal">₦{stats.revenue.toLocaleString()}</h2>
        </Card>
        
        <a href="/vendor/orders" className="block">
          <Card padding="md" className="border-l-4 border-l-market-green hover:shadow-lg transition-shadow cursor-pointer h-full">
            <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Orders to Fulfill</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-coal">{stats.pendingOrders}</h2>
              {stats.pendingOrders > 0 && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-market-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-market-green"></span>
                </span>
              )}
            </div>
          </Card>
        </a>

        <Card padding="md" className="border-l-4 border-l-coal">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Active Products</p>
          <h2 className="text-3xl font-black text-coal">{stats.activeProducts}</h2>
        </Card>

        <Card padding="md" className="border-l-4 border-l-gold-dust">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Store Rating</p>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black text-coal">{stats.rating}</h2>
            <span className="text-gold-dust text-xl">★</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card padding="md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-coal">Recent Orders</h3>
              <a href="/vendor/orders" className="text-ember text-sm font-bold hover:underline">View All</a>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-coal/10 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-coal/5 rounded-lg"></div>
                    <div>
                      <p className="font-bold text-coal">Product Name {i}</p>
                      <p className="text-sm text-coal/60">Qty: 1 • Ref: FSH-20260612-{i}A{i}B</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Fulfill</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card padding="md" className="bg-coal text-white">
            <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
            <p className="text-white/70 text-sm mb-6">Access vendor resources, tutorials, and support center to grow your business on Fushion.</p>
            <Button variant="secondary" className="w-full bg-white/10 text-white border-transparent hover:bg-white/20">
              Vendor Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
