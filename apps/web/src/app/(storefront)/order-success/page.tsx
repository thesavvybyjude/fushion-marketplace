'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, Button } from '@/components/ui';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-16 md:py-24 w-full text-center flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-market-green/10 rounded-full flex items-center justify-center mb-8">
          <CheckCircle className="w-10 h-10 text-market-green" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-coal mb-4">Order Confirmed</h1>
        <p className="text-lg text-coal/60 mb-2 max-w-md">
          Thank you for your purchase! Your order has been placed successfully and our vendors have been notified.
        </p>
        
        {ref && (
          <p className="text-sm text-coal/40 mb-8">
            Reference: <span className="font-mono font-bold text-coal/60">{ref}</span>
          </p>
        )}

        <Card padding="md" className="w-full max-w-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ember/10 rounded-full flex items-center justify-center shrink-0">
              <Package className="w-6 h-6 text-ember" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-coal text-sm">What happens next?</h3>
              <p className="text-xs text-coal/60">You'll receive an email confirmation shortly. Track your order from your account page.</p>
            </div>
          </div>
        </Card>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a href="/account" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2">
              View My Orders <ArrowRight size={16} />
            </Button>
          </a>
          <a href="/" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full">Continue Shopping</Button>
          </a>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
