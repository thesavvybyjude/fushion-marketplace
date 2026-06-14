'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button, Input, Card } from '@/components/ui';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock register delay
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/account';
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-20 w-full flex items-center justify-center">
        <Card padding="lg" className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-coal mb-2">Create an Account</h1>
            <p className="text-sm text-coal/60">Join Nigeria&apos;s premier marketplace</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Chidi Okeke"
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
            
            <div className="flex items-start gap-2 pt-2">
              <input 
                type="checkbox" 
                id="vendor-signup" 
                className="mt-1 w-4 h-4 rounded border-coal/20 text-ember focus:ring-ember/20"
              />
              <label htmlFor="vendor-signup" className="text-sm text-coal/80">
                I want to become a vendor and sell products on Fushion
              </label>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-coal/60">
            Already have an account?{' '}
            <a href="/login" className="font-bold text-coal hover:text-ember transition-colors">
              Sign In
            </a>
          </div>
        </Card>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
