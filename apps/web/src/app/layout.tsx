import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import '@/styles/globals.css';
import { PwaRegister } from '@/components/pwa-register';
import { ToastContainer } from '@/components/ui';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Fushion — Every Market. One Place.',
    template: '%s | Fushion',
  },
  description:
    'Nigeria\'s multi-vendor marketplace. Shop electronics, fashion, home goods and more from trusted vendors. Every market. One place.',
  keywords: ['fushion', 'marketplace', 'nigeria', 'online shopping', 'multi-vendor', 'ecommerce'],
  authors: [{ name: 'Fushion' }],
  manifest: '/manifest.json',
  themeColor: '#E8642A',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Fushion',
    title: 'Fushion — Every Market. One Place.',
    description: 'Nigeria\'s multi-vendor marketplace.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fushion — Every Market. One Place.',
    description: 'Nigeria\'s multi-vendor marketplace.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E8642A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased min-h-screen flex flex-col bg-paper scroll-smooth">
        <PwaRegister />
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
