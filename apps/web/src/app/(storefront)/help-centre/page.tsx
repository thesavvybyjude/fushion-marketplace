'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card } from '@/components/ui';
import { HelpCircle, Package, Truck, ShieldAlert } from 'lucide-react';

export default function HelpCentrePage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-20 w-full">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-coal mb-4">How can we help?</h1>
          <p className="text-lg text-coal/60 max-w-2xl mx-auto">
            Search our knowledge base or browse categories below to find answers to your questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card padding="lg" className="text-center flex flex-col items-center hover:border-ember/30 transition-colors cursor-pointer">
            <Package className="w-10 h-10 text-ember mb-4" />
            <h3 className="font-bold text-coal mb-2">Orders & Tracking</h3>
            <p className="text-sm text-coal/60">Where is my order?</p>
          </Card>
          <Card padding="lg" className="text-center flex flex-col items-center hover:border-ember/30 transition-colors cursor-pointer">
            <Truck className="w-10 h-10 text-market-green mb-4" />
            <h3 className="font-bold text-coal mb-2">Delivery</h3>
            <p className="text-sm text-coal/60">Shipping timelines & costs</p>
          </Card>
          <Card padding="lg" className="text-center flex flex-col items-center hover:border-ember/30 transition-colors cursor-pointer">
            <ShieldAlert className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="font-bold text-coal mb-2">Returns & Refunds</h3>
            <p className="text-sm text-coal/60">How to return an item</p>
          </Card>
          <Card padding="lg" className="text-center flex flex-col items-center hover:border-ember/30 transition-colors cursor-pointer">
            <HelpCircle className="w-10 h-10 text-gold-dust mb-4" />
            <h3 className="font-bold text-coal mb-2">FAQs</h3>
            <p className="text-sm text-coal/60">General questions</p>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
