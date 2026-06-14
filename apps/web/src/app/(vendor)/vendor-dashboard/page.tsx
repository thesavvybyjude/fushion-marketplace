'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, Button } from '@/components/ui';
import { Store, TrendingUp, Package, Users, DollarSign, Settings, Bell } from 'lucide-react';

export default function VendorDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full flex flex-col md:flex-row gap-8">
        
        {/* Vendor Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <Card padding="sm" className="sticky top-24">
            <div className="p-4 border-b border-coal/5 mb-2">
              <h2 className="font-bold text-coal flex items-center gap-2">
                <Store size={20} className="text-ember" /> Gadget Hub
              </h2>
              <p className="text-xs text-coal/60 mt-1">Pro Seller Plan</p>
            </div>
            <nav className="flex flex-col gap-1">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-ember/10 text-ember font-bold">
                <TrendingUp size={20} strokeWidth={2} />
                Overview
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-coal/70 hover:bg-coal/5 hover:text-coal transition-colors font-medium">
                <Package size={20} strokeWidth={2} />
                Products
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-coal/70 hover:bg-coal/5 hover:text-coal transition-colors font-medium">
                <Users size={20} strokeWidth={2} />
                Customers
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-coal/70 hover:bg-coal/5 hover:text-coal transition-colors font-medium">
                <DollarSign size={20} strokeWidth={2} />
                Payouts
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-coal/70 hover:bg-coal/5 hover:text-coal transition-colors font-medium">
                <Settings size={20} strokeWidth={2} />
                Store Settings
              </a>
            </nav>
          </Card>
        </aside>

        {/* Dashboard Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-coal mb-1">Dashboard</h1>
              <p className="text-coal/60">Welcome back, Adebayo! Here's what's happening with your store today.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" className="px-3"><Bell size={18} /></Button>
              <Button>Add Product</Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card padding="md">
              <h4 className="text-sm text-coal/60 mb-2">Total Sales (This Month)</h4>
              <p className="text-2xl font-black text-coal mb-2">₦1,250,000</p>
              <p className="text-xs text-market-green font-bold">+15.2% from last month</p>
            </Card>
            <Card padding="md">
              <h4 className="text-sm text-coal/60 mb-2">Active Orders</h4>
              <p className="text-2xl font-black text-coal mb-2">24</p>
              <p className="text-xs text-coal/60">8 requiring action</p>
            </Card>
            <Card padding="md">
              <h4 className="text-sm text-coal/60 mb-2">Total Products</h4>
              <p className="text-2xl font-black text-coal mb-2">156</p>
              <p className="text-xs text-red-500 font-bold">12 low in stock</p>
            </Card>
            <Card padding="md">
              <h4 className="text-sm text-coal/60 mb-2">Store Rating</h4>
              <p className="text-2xl font-black text-coal mb-2">4.8 / 5.0</p>
              <p className="text-xs text-coal/60">Based on 342 reviews</p>
            </Card>
          </div>

          {/* Recent Orders Table */}
          <Card padding="lg">
            <h3 className="text-lg font-bold text-coal mb-4">Recent Orders to Fulfill</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-coal/10 text-coal/60">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coal/5">
                  <tr>
                    <td className="py-4 font-medium text-coal">#FUS-9823741</td>
                    <td className="py-4">Infinix Zero 30 5G</td>
                    <td className="py-4 text-coal/60">June 14, 2026</td>
                    <td className="py-4"><span className="px-2 py-1 bg-ember/10 text-ember text-xs font-bold rounded">New</span></td>
                    <td className="py-4 text-right"><Button variant="secondary" size="sm">Fulfill</Button></td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-coal">#FUS-9823742</td>
                    <td className="py-4">Samsung Galaxy S24 Ultra</td>
                    <td className="py-4 text-coal/60">June 13, 2026</td>
                    <td className="py-4"><span className="px-2 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded">Processing</span></td>
                    <td className="py-4 text-right"><Button variant="secondary" size="sm">Update</Button></td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-coal">#FUS-9823730</td>
                    <td className="py-4">AirPods Pro</td>
                    <td className="py-4 text-coal/60">June 12, 2026</td>
                    <td className="py-4"><span className="px-2 py-1 bg-market-green/10 text-market-green text-xs font-bold rounded">Shipped</span></td>
                    <td className="py-4 text-right"><Button variant="secondary" size="sm">View</Button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
