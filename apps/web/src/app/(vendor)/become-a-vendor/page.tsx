'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button, Card } from '@/components/ui';
import { Store, TrendingUp, Wallet, ShieldCheck } from 'lucide-react';

export default function BecomeAVendorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 w-full pb-20 md:pb-0">
        
        {/* Hero */}
        <section className="bg-coal text-white py-20 px-4 md:py-32 relative overflow-hidden text-center">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />
          <div className="max-w-3xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Grow your business with <span className="text-ember">Fushion.</span>
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of sellers across Nigeria reaching millions of customers every day. Setup is fast, simple, and profitable.
            </p>
            <a href="/register">
              <Button size="lg" className="px-10 py-4 text-lg">Start Selling Today</Button>
            </a>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-coal mb-4">Why sell on Fushion?</h2>
            <p className="text-coal/60 max-w-2xl mx-auto">We provide the tools and audience you need to scale your sales to the next level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card padding="lg" className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-ember/10 text-ember rounded-full flex items-center justify-center mb-6">
                <Store size={32} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-coal mb-2">Free Storefront</h3>
              <p className="text-sm text-coal/70">Set up your digital shop in minutes. No upfront costs or technical skills required.</p>
            </Card>

            <Card padding="lg" className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-market-green/10 text-market-green rounded-full flex items-center justify-center mb-6">
                <TrendingUp size={32} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-coal mb-2">Reach Millions</h3>
              <p className="text-sm text-coal/70">Access our massive customer base actively looking for products like yours.</p>
            </Card>

            <Card padding="lg" className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-6">
                <Wallet size={32} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-coal mb-2">Fast Payouts</h3>
              <p className="text-sm text-coal/70">Get your money quickly after every successful delivery directly to your bank account.</p>
            </Card>

            <Card padding="lg" className="text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-gold-dust/10 text-gold-dust rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={32} strokeWidth={2} />
              </div>
              <h3 className="font-bold text-coal mb-2">Seller Protection</h3>
              <p className="text-sm text-coal/70">We protect our vendors from fraudulent buyers and handle all customer service disputes.</p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ember/5 py-20 px-4 mt-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-black text-coal mb-6">Ready to make your first sale?</h2>
            <a href="/register">
              <Button size="lg" className="px-10">Create Vendor Account</Button>
            </a>
          </div>
        </section>

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
