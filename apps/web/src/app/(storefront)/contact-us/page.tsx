'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Card, Input, Textarea, Button } from '@/components/ui';

export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 md:py-20 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-coal mb-6">Contact Us</h1>
          <p className="text-lg text-coal/60 mb-8">
            Have a question, feedback, or need assistance? We're here to help. Fill out the form and our team will get back to you within 24 hours.
          </p>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-coal text-lg">Email Support</h3>
              <p className="text-coal/60">support@fushion.ng</p>
            </div>
            <div>
              <h3 className="font-bold text-coal text-lg">Operating Hours</h3>
              <p className="text-coal/60">Monday - Saturday: 8am - 6pm (WAT)</p>
            </div>
          </div>
        </div>

        <div>
          <Card padding="lg">
            <form className="space-y-4">
              <Input label="Full Name" placeholder="Your name" required />
              <Input label="Email Address" type="email" placeholder="you@example.com" required />
              <Input label="Subject" placeholder="How can we help?" required />
              <Textarea label="Message" placeholder="Type your message here..." required />
              <Button type="button" className="w-full">Send Message</Button>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
