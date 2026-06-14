import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button } from '@/components/ui';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-20 md:py-32 w-full text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-coal/5 rounded-full flex items-center justify-center mb-8">
          <Search className="w-10 h-10 text-coal/40" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-coal mb-4">Page Not Found</h1>
        <p className="text-lg text-coal/60 mb-10 max-w-md">
          We couldn't find the page you're looking for. It might have been moved or no longer exists.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a href="/" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">Return Home</Button>
          </a>
          <a href="/search" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full">Search Products</Button>
          </a>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
