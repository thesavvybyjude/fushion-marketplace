'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function ReturnsPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 md:py-20 w-full">
        <h1 className="text-3xl md:text-5xl font-black text-coal mb-8">Returns & Refunds Policy</h1>
        <div className="prose prose-coal max-w-none">
          
          <h3>Our Return Policy</h3>
          <p>
            We want you to be completely satisfied with your purchase. If you are not satisfied, you may return the item within 7 days of delivery for a full refund or exchange, subject to the terms below.
          </p>
          
          <h3>Conditions for Return</h3>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The item must be unused, unworn, and in the same condition that you received it.</li>
            <li>The item must be in its original packaging with all tags attached.</li>
            <li>You must have the receipt or proof of purchase.</li>
            <li>Certain items cannot be returned: perishable goods, custom-made items, and personal care products.</li>
          </ul>

          <h3>How to Initiate a Return</h3>
          <p>
            1. Log in to your Fushion account.<br/>
            2. Go to 'My Orders' and select the order you wish to return.<br/>
            3. Click 'Initiate Return' and follow the instructions provided.<br/>
            4. Our courier partner will contact you to schedule a pickup.
          </p>

          <h3>Refunds</h3>
          <p>
            Once your return is received and inspected by the vendor, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed and applied to your original method of payment within 3-5 business days.
          </p>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
