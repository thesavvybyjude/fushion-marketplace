'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useCartStore } from '@/stores/cart.store';
import { Button, Card } from '@/components/ui';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const cartStore = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid SSR hydration mismatch

  const { items, updateQuantity, removeItem, getSubtotal, getGroupedByVendor } = cartStore;
  const groupedItems = getGroupedByVendor();
  const subtotal = getSubtotal();

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-coal mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-coal/5">
            <div className="w-20 h-20 bg-coal/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-coal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-coal mb-2">Your cart is empty</h2>
            <p className="text-coal/60 mb-8 max-w-sm mx-auto">
              Looks like you haven&apos;t added anything to your cart yet. Discover amazing products from vendors across Nigeria.
            </p>
            <a href="/products">
              <Button size="lg">Start Shopping</Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(groupedItems).map(([vendorId, vendorItems]) => (
                <Card key={vendorId} padding="md" className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-coal/5">
                    <span className="text-sm font-bold text-coal">
                      Sold by <span className="text-market-green">{vendorItems[0].vendorName}</span>
                    </span>
                  </div>
                  
                  <div className="divide-y divide-coal/5">
                    {vendorItems.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                        {/* Image */}
                        <a href={`/product/${item.slug}`} className="shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg bg-coal/5" />
                          ) : (
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-coal/5 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-coal/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </a>
                        
                        {/* Details */}
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="flex justify-between items-start gap-4 mb-1">
                            <a href={`/product/${item.slug}`} className="text-sm md:text-base font-bold text-coal hover:text-ember transition-colors line-clamp-2">
                              {item.name}
                            </a>
                            <p className="text-base font-bold text-ember whitespace-nowrap">
                              ₦{item.price.toLocaleString()}
                            </p>
                          </div>
                          
                          {item.variantName && (
                            <p className="text-xs text-coal/60 mb-2">{item.variantName}</p>
                          )}
                          
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-paper rounded-lg border border-coal/5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-coal hover:text-ember disabled:opacity-30"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-coal hover:text-ember disabled:opacity-30"
                                disabled={!!item.maxStock && item.quantity >= item.maxStock}
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs font-medium text-coal/60 hover:text-red-500 transition-colors flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-20">
              <Card padding="lg" className="flex flex-col gap-6">
                <h2 className="text-lg font-bold text-coal">Order Summary</h2>
                
                <div className="space-y-3 text-sm text-coal/80">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-medium text-coal">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Delivery</span>
                    <span className="text-coal/60 text-xs text-right max-w-[150px]">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="border-t border-coal/10 pt-4 flex justify-between items-end">
                  <span className="font-bold text-coal">Total</span>
                  <span className="text-2xl font-bold text-ember">₦{subtotal.toLocaleString()}</span>
                </div>
                
                <a href="/checkout" className="w-full">
                  <Button size="lg" fullWidth>
                    Proceed to Checkout
                  </Button>
                </a>
                
                <div className="flex items-center justify-center gap-2 text-xs text-coal/40 mt-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure checkout provided by Paystack
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
