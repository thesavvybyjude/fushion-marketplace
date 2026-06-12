'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import { api } from '@/lib/api';
import { toast_error } from '@/components/ui';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalSales: 0,
    activeVendors: 0,
    pendingProducts: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await api.get<{ data: typeof stats }>('/admin/stats');
        setStats(res.data);
      } catch (error) {
        toast_error('Failed to load dashboard stats');
        // fallback to mock for MVP preview
        setStats({
          totalSales: 4500000,
          activeVendors: 142,
          pendingProducts: 24,
          totalOrders: 890
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-black text-coal mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card padding="md" className="border-l-4 border-l-ember flex flex-col justify-center">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Total Sales</p>
          <h2 className="text-3xl font-black text-coal">
            {loading ? '...' : `₦${stats.totalSales.toLocaleString()}`}
          </h2>
        </Card>
        
        <Card padding="md" className="border-l-4 border-l-market-green flex flex-col justify-center">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Active Vendors</p>
          <h2 className="text-3xl font-black text-coal">
            {loading ? '...' : stats.activeVendors.toLocaleString()}
          </h2>
        </Card>

        <a href="/admin/products" className="block">
          <Card padding="md" className="border-l-4 border-l-gold-dust flex flex-col justify-center hover:shadow-lg transition-shadow cursor-pointer h-full">
            <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Pending Products</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-coal">
                {loading ? '...' : stats.pendingProducts}
              </h2>
              {stats.pendingProducts > 0 && (
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ember opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-ember"></span>
                </span>
              )}
            </div>
          </Card>
        </a>

        <Card padding="md" className="border-l-4 border-l-coal flex flex-col justify-center">
          <p className="text-sm font-bold text-coal/60 uppercase tracking-wider mb-1">Total Orders</p>
          <h2 className="text-3xl font-black text-coal">
            {loading ? '...' : stats.totalOrders.toLocaleString()}
          </h2>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card padding="md">
          <h3 className="text-lg font-bold text-coal mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/products" className="flex items-center justify-between p-4 bg-coal/5 rounded-xl hover:bg-coal/10 transition-colors">
              <span className="font-bold text-coal">Review Pending Products</span>
              <span className="text-ember font-bold">→</span>
            </a>
            <a href="/admin/payouts" className="flex items-center justify-between p-4 bg-coal/5 rounded-xl hover:bg-coal/10 transition-colors">
              <span className="font-bold text-coal">Process Vendor Payouts</span>
              <span className="text-ember font-bold">→</span>
            </a>
            <a href="/admin/vendors" className="flex items-center justify-between p-4 bg-coal/5 rounded-xl hover:bg-coal/10 transition-colors">
              <span className="font-bold text-coal">Manage Vendors</span>
              <span className="text-ember font-bold">→</span>
            </a>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-lg font-bold text-coal mb-4">Recent Activity</h3>
          <div className="text-sm text-coal/60 text-center py-8">
            Activity feed will be available in Phase 4.
          </div>
        </Card>
      </div>
    </div>
  );
}
