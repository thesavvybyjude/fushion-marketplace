'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-20 md:py-32 w-full text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-black text-coal mb-4">Something went wrong</h1>
        <p className="text-lg text-coal/60 mb-10 max-w-md">
          We encountered an unexpected error while processing your request. Our engineering team has been notified.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button onClick={() => reset()} size="lg" className="w-full sm:w-auto bg-coal hover:bg-coal/90 text-white border-none">
            Try Again
          </Button>
          <a href="/" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full">Return Home</Button>
          </a>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
