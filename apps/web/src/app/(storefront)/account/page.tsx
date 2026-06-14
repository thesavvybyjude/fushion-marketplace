'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, Button } from '@/components/ui';
import { User, Package, MapPin, Settings, LogOut } from 'lucide-react';

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <Card padding="sm" className="sticky top-24">
            <nav className="flex flex-col gap-1">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-ember/10 text-ember font-bold">
                <Package size={20} strokeWidth={2} />
                My Orders
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-coal/70 hover:bg-coal/5 hover:text-coal transition-colors font-medium">
                <User size={20} strokeWidth={2} />
                Profile Info
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-coal/70 hover:bg-coal/5 hover:text-coal transition-colors font-medium">
                <MapPin size={20} strokeWidth={2} />
                Addresses
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-coal/70 hover:bg-coal/5 hover:text-coal transition-colors font-medium">
                <Settings size={20} strokeWidth={2} />
                Settings
              </a>
              <div className="my-2 border-t border-coal/5"></div>
              <a href="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors font-medium">
                <LogOut size={20} strokeWidth={2} />
                Log Out
              </a>
            </nav>
          </Card>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-coal mb-2">My Orders</h1>
            <p className="text-coal/60">View and track your recent purchases</p>
          </div>

          <div className="space-y-6">
            {/* Mock Order 1 */}
            <Card padding="md">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-coal/5">
                <div>
                  <p className="text-sm text-coal/60">Order #FUS-1928374</p>
                  <p className="text-sm font-bold text-coal">Placed on June 12, 2026</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-market-green/10 text-market-green font-bold text-xs rounded-full">Delivered</span>
                  <span className="text-lg font-black text-ember">₦25,000</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-coal/5 rounded-lg overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1515347619362-717472ba89dd?q=80&w=200&auto=format&fit=crop" alt="Dress" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-coal">Ankara Print Maxi Dress</h4>
                  <p className="text-sm text-coal/60">Qty: 1 • Lagos Styles</p>
                </div>
                <div>
                  <Button variant="secondary" size="sm">Buy Again</Button>
                </div>
              </div>
            </Card>

            {/* Mock Order 2 */}
            <Card padding="md">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-coal/5">
                <div>
                  <p className="text-sm text-coal/60">Order #FUS-9823741</p>
                  <p className="text-sm font-bold text-coal">Placed on June 10, 2026</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-ember/10 text-ember font-bold text-xs rounded-full">Processing</span>
                  <span className="text-lg font-black text-ember">₦350,000</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-coal/5 rounded-lg overflow-hidden shrink-0">
                  <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200&auto=format&fit=crop" alt="Phone" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-coal">Infinix Zero 30 5G</h4>
                  <p className="text-sm text-coal/60">Qty: 1 • Gadget Hub</p>
                </div>
                <div>
                  <Button variant="secondary" size="sm">Track Order</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
