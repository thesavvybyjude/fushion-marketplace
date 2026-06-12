'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/stores/cart.store';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button, Input, Card } from '@/components/ui';
import { api } from '@/lib/api';
import { toast_error, toast_success } from '@/components/ui';

type CheckoutStep = 'address' | 'payment' | 'review';

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<CheckoutStep>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    city: '',
    state: '',
  });
  
  const cartStore = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);
    
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!mounted) return null;

  const { items, getSubtotal, clearCart } = cartStore;
  const subtotal = getSubtotal();
  const deliveryFee = 2500; // Flat fee for Phase 2
  const total = subtotal + deliveryFee;

  if (items.length === 0 && step !== 'review') {
    return (
      <div className="min-h-screen flex flex-col bg-paper">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-8">
            <h2 className="text-xl font-bold text-coal mb-2">Cart is empty</h2>
            <p className="text-coal/60 mb-6">You need items in your cart to checkout.</p>
            <a href="/"><Button fullWidth>Return to Shop</Button></a>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async () => {
    try {
      setIsProcessing(true);
      
      // 1. Create order on backend
      const response = await api.post<{ data: { order: any; authorizationUrl: string; reference: string } }>(
        '/orders/checkout',
        {
          items: items.map(i => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          address,
        }
      );

      const { reference } = response.data;
      const PAYSTACK_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';

      // 2. Open Paystack Inline Modal
      const handler = (window as any).PaystackPop.setup({
        key: PAYSTACK_KEY,
        email: 'buyer@fushion.dev', // Hardcoded for Phase 2 demo, normally from user profile
        amount: total * 100, // in kobo
        currency: 'NGN',
        ref: reference,
        callback: function (paystackResponse: any) {
          // Success! Webhook will handle fulfillment. Just clear cart and redirect.
          clearCart();
          toast_success('Payment successful! Order confirmed.');
          window.location.href = `/order-success?ref=${paystackResponse.reference}`;
        },
        onClose: function () {
          setIsProcessing(false);
          toast_error('Payment cancelled');
        },
      });

      handler.openIframe();
    } catch (error: any) {
      setIsProcessing(false);
      toast_error(error.message || 'Checkout failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 'address' ? 'bg-ember text-white' : 'bg-market-green text-white'}`}>
              {step === 'address' ? '1' : '✓'}
            </div>
            <span className={`text-sm font-medium ${step === 'address' ? 'text-coal' : 'text-market-green'}`}>Address</span>
          </div>
          <div className={`w-12 md:w-24 h-1 mx-4 rounded-full ${step === 'payment' || step === 'review' ? 'bg-market-green' : 'bg-coal/10'}`} />
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 'payment' ? 'bg-ember text-white' : step === 'review' ? 'bg-market-green text-white' : 'bg-coal/10 text-coal/40'}`}>
              {step === 'review' ? '✓' : '2'}
            </div>
            <span className={`text-sm font-medium ${step === 'payment' ? 'text-coal' : step === 'review' ? 'text-market-green' : 'text-coal/40'}`}>Payment</span>
          </div>
          <div className={`w-12 md:w-24 h-1 mx-4 rounded-full ${step === 'review' ? 'bg-market-green' : 'bg-coal/10'}`} />
          
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step === 'review' ? 'bg-ember text-white' : 'bg-coal/10 text-coal/40'}`}>
              3
            </div>
            <span className={`text-sm font-medium ${step === 'review' ? 'text-coal' : 'text-coal/40'}`}>Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            
            {step === 'address' && (
              <Card padding="lg">
                <h2 className="text-xl font-bold text-coal mb-6">Delivery Address</h2>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" required value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} />
                    <Input label="Last Name" required value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} />
                  </div>
                  <Input label="Phone Number" type="tel" required value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                  <Input label="Street Address" required value={address.address1} onChange={(e) => setAddress({ ...address, address1: e.target.value })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="City" required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                    <Input label="State" required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" size="lg">Continue to Payment</Button>
                  </div>
                </form>
              </Card>
            )}

            {step === 'payment' && (
              <Card padding="lg">
                <h2 className="text-xl font-bold text-coal mb-2">Payment Method</h2>
                <p className="text-coal/60 text-sm mb-6">Select how you want to pay. All transactions are secure.</p>
                
                {/* Paystack Tabs Simulation */}
                <div className="space-y-3 mb-8">
                  <label className="flex items-center p-4 border border-ember bg-ember/5 rounded-xl cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="text-ember focus:ring-ember w-4 h-4" />
                    <div className="ml-3 flex-1">
                      <span className="block text-sm font-bold text-coal">Pay with Paystack</span>
                      <span className="block text-xs text-coal/60">Card, Bank Transfer, USSD, Mobile Money</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-8 h-5 bg-white border border-coal/10 rounded flex items-center justify-center text-[8px] font-bold text-blue-900">VISA</div>
                      <div className="w-8 h-5 bg-white border border-coal/10 rounded flex items-center justify-center text-[8px] font-bold text-red-600">MC</div>
                    </div>
                  </label>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-coal/10">
                  <button onClick={() => setStep('address')} className="text-sm font-medium text-coal hover:text-ember">
                    ← Back to Address
                  </button>
                  <Button onClick={() => setStep('review')} size="lg">Review Order</Button>
                </div>
              </Card>
            )}

            {step === 'review' && (
              <Card padding="lg" className="space-y-6">
                <h2 className="text-xl font-bold text-coal">Review Your Order</h2>
                
                <div className="bg-paper p-4 rounded-xl border border-coal/5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-sm text-coal">Delivery Details</h3>
                    <button onClick={() => setStep('address')} className="text-xs font-medium text-ember hover:underline">Edit</button>
                  </div>
                  <p className="text-sm text-coal/70">
                    {address.firstName} {address.lastName}<br/>
                    {address.address1}, {address.city}, {address.state}<br/>
                    {address.phone}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-coal/10 flex justify-between items-center">
                  <button onClick={() => setStep('payment')} className="text-sm font-medium text-coal hover:text-ember">
                    ← Back to Payment
                  </button>
                  <Button onClick={handlePaymentSubmit} loading={isProcessing} size="lg" className="px-8">
                    Pay ₦{total.toLocaleString()}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <Card padding="md" className="sticky top-20 bg-white">
              <h3 className="font-bold text-coal mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="relative w-12 h-12 bg-coal/5 rounded-md overflow-hidden shrink-0">
                      {item.image && <img src={item.image} alt={item.name} className="object-cover w-full h-full" />}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-coal text-white text-[10px] rounded-full flex items-center justify-center font-bold border border-white">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-coal font-medium">{item.name}</p>
                      <p className="text-xs text-coal/60">{item.vendorName}</p>
                    </div>
                    <div className="font-bold text-coal whitespace-nowrap">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-coal/5 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-coal/70">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-coal/70">
                  <span>Delivery</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="border-t border-coal/10 mt-4 pt-4 flex justify-between items-end">
                <span className="font-bold text-coal">Total</span>
                <span className="text-xl font-bold text-ember">₦{total.toLocaleString()}</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
