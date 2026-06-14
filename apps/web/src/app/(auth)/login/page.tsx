'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button, Input, Card, toast_error, toast_success } from '@/components/ui';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post<{ data: { accessToken: string; user: { role: string } } }>('/auth/login', { email, password });
      
      const { accessToken, user } = response.data;
      
      // Set cookies for middleware
      document.cookie = `fushion_token=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      document.cookie = `fushion_role=${user.role}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      
      api.setAccessToken(accessToken);
      toast_success('Welcome back!');
      
      if (user.role === 'ADMIN') {
        window.location.href = '/admin';
      } else if (user.role === 'VENDOR') {
        window.location.href = '/vendor/dashboard';
      } else {
        window.location.href = '/account';
      }
    } catch (error: any) {
      toast_error(error.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-20 w-full flex items-center justify-center">
        <Card padding="lg" className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-coal mb-2">Welcome Back</h1>
            <p className="text-sm text-coal/60">Sign in to your Fushion account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <div className="flex justify-end">
                <a href="#" className="text-xs font-medium text-ember hover:underline">
                  Forgot Password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-coal/60">
            Don&apos;t have an account?{' '}
            <a href="/register" className="font-bold text-coal hover:text-ember transition-colors">
              Register here
            </a>
          </div>
        </Card>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
