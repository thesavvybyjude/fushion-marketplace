'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const fullName = (formData.get('fullName') as string).trim();
      const nameParts = fullName.split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

      const res: any = await api.post('/auth/register', {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        firstName,
        lastName,
      });

      api.setAccessToken(res.data.accessToken);
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-coal">
            Fu<span className="text-ember">sh</span>ion
          </Link>
          <p className="text-coal/60 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="Chidi Okeke"
            required
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="At least 8 characters"
            minLength={8}
            required
          />

          <div className="flex items-start gap-2 pt-2">
            <input
              type="checkbox"
              id="vendor-signup"
              name="becomeVendor"
              className="mt-1 w-4 h-4 rounded border-coal/20 text-ember focus:ring-ember/20"
            />
            <label htmlFor="vendor-signup" className="text-sm text-coal/80">
              I want to become a vendor and sell products on Fushion
            </label>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-coal/60 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-ember font-medium hover:text-ember/80">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}
