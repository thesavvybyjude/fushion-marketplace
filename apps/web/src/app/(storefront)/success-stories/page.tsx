'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card } from '@/components/ui';
import { Star } from 'lucide-react';

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-20 w-full">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-black text-coal mb-4">Vendor Success Stories</h1>
          <p className="text-lg text-coal/60 max-w-2xl mx-auto">
            See how independent entrepreneurs across Nigeria are growing their businesses and changing their lives on Fushion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card padding="lg" className="flex flex-col h-full">
            <div className="flex text-gold-dust mb-6">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
            </div>
            <p className="text-lg text-coal leading-relaxed mb-8 flex-1 italic">
              "Before joining Fushion, my boutique was only reaching people in my neighborhood. Within three months of setting up my digital storefront, my revenue tripled. Fushion handles all the payment logistics seamlessly."
            </p>
            <div className="flex items-center gap-4 border-t border-coal/10 pt-6">
              <div className="w-12 h-12 bg-coal/10 rounded-full flex items-center justify-center font-bold text-coal">CN</div>
              <div>
                <h4 className="font-bold text-coal">Chioma Nnamdi</h4>
                <p className="text-sm text-coal/60">Owner, Lagos Styles</p>
              </div>
            </div>
          </Card>

          <Card padding="lg" className="flex flex-col h-full">
            <div className="flex text-gold-dust mb-6">
              {[1, 2, 3, 4, 5].map((i) => <Star key={i} fill="currentColor" className="w-5 h-5" />)}
            </div>
            <p className="text-lg text-coal leading-relaxed mb-8 flex-1 italic">
              "The seller protection and fast payouts on Fushion are unmatched. I used to worry about fraudulent buyers on social media, but Fushion's platform gave me peace of mind to focus on expanding my inventory."
            </p>
            <div className="flex items-center gap-4 border-t border-coal/10 pt-6">
              <div className="w-12 h-12 bg-coal/10 rounded-full flex items-center justify-center font-bold text-coal">AA</div>
              <div>
                <h4 className="font-bold text-coal">Adebayo Alabi</h4>
                <p className="text-sm text-coal/60">Founder, Gadget Hub</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
