'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 md:py-20 w-full">
        <h1 className="text-3xl md:text-5xl font-black text-coal mb-8">Terms of Service</h1>
        <div className="prose prose-coal max-w-none">
          <p className="text-sm text-coal/60 mb-8">Last Updated: June 14, 2026</p>
          
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using Fushion, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
          
          <h3>2. Marketplace Platform</h3>
          <p>
            Fushion is a multi-vendor marketplace platform that connects independent sellers with buyers. We are not the retailer of any products listed on the platform by third-party vendors. The contract of sale is strictly between the buyer and the vendor.
          </p>

          <h3>3. User Accounts</h3>
          <p>
            To use certain features of the platform, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h3>4. Prohibited Activities</h3>
          <p>
            Users may not:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Violate any local or international laws.</li>
              <li>Post false, inaccurate, misleading, defamatory, or libelous content.</li>
              <li>Distribute viruses or any other technologies that may harm Fushion or the interests of our users.</li>
              <li>Harvest or otherwise collect information about users without their consent.</li>
            </ul>
          </p>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
