'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, Button } from '@/components/ui';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-20 w-full">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-coal mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-coal/60 max-w-2xl mx-auto">
            No hidden fees. You only pay a small commission when you make a sale. Start selling on Fushion today!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Tier */}
          <Card padding="lg" className="border-2 border-transparent">
            <h3 className="text-2xl font-bold text-coal mb-2">Standard Seller</h3>
            <p className="text-coal/60 mb-6">Perfect for new and growing businesses.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-coal">Free</span>
              <span className="text-coal/60 ml-2">to join</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3"><Check className="text-market-green w-5 h-5" /> Unlimited product listings</li>
              <li className="flex items-center gap-3"><Check className="text-market-green w-5 h-5" /> Basic vendor dashboard</li>
              <li className="flex items-center gap-3"><Check className="text-market-green w-5 h-5" /> 5% Commission per sale</li>
            </ul>
            <a href="/register"><Button className="w-full">Create Vendor Account</Button></a>
          </Card>

          {/* Premium Tier */}
          <Card padding="lg" className="border-2 border-ember relative overflow-hidden shadow-2xl shadow-ember/10">
            <div className="absolute top-0 right-0 bg-ember text-white px-4 py-1 font-bold text-xs rounded-bl-lg">POPULAR</div>
            <h3 className="text-2xl font-bold text-coal mb-2">Pro Seller</h3>
            <p className="text-coal/60 mb-6">For established brands scaling fast.</p>
            <div className="mb-6">
              <span className="text-4xl font-black text-coal">₦15,000</span>
              <span className="text-coal/60 ml-2">/ month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3"><Check className="text-ember w-5 h-5" /> Lower commission rate (2.5%)</li>
              <li className="flex items-center gap-3"><Check className="text-ember w-5 h-5" /> Priority search ranking</li>
              <li className="flex items-center gap-3"><Check className="text-ember w-5 h-5" /> Advanced analytics & reports</li>
            </ul>
            <a href="/register"><Button variant="primary" className="w-full bg-coal hover:bg-coal/90">Upgrade to Pro</Button></a>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
