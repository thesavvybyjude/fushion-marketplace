'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button, Badge, toast_success } from '@/components/ui';
import { useCartStore } from '@/stores/cart.store';

// Mock data for Phase 2 UI
const MOCK_PRODUCT = {
  id: 'prod-123',
  name: 'Ankara Print Maxi Dress - Summer Collection',
  slug: 'ankara-print-maxi-dress',
  price: 25000,
  compareAtPrice: 35000,
  description: 'Beautiful Ankara print maxi dress perfect for summer outings and casual events. Made from 100% cotton authentic Nigerian fabric. Features two side pockets and an elastic waist for comfortable fit.',
  vendorId: 'vendor-1',
  vendorName: 'Lagos Styles',
  vendorRating: 4.8,
  images: [
    'https://images.unsplash.com/photo-1515347619362-717472ba89dd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550614000-4b95d4ebf0cd?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589317621382-0cbdef768fa5?q=80&w=800&auto=format&fit=crop'
  ],
  rating: 4.5,
  reviewCount: 128,
  variants: [
    { id: 'v-1', name: 'Size S', price: 25000, stock: 5 },
    { id: 'v-2', name: 'Size M', price: 25000, stock: 12 },
    { id: 'v-3', name: 'Size L', price: 25000, stock: 2 },
    { id: 'v-4', name: 'Size XL', price: 27000, stock: 0 },
  ],
  tags: ['Fashion', 'Women', 'Ankara', 'Dresses']
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(MOCK_PRODUCT.variants[0]);
  
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: MOCK_PRODUCT.id,
      name: MOCK_PRODUCT.name,
      slug: MOCK_PRODUCT.slug,
      price: selectedVariant ? selectedVariant.price : MOCK_PRODUCT.price,
      quantity,
      vendorId: MOCK_PRODUCT.vendorId,
      vendorName: MOCK_PRODUCT.vendorName,
      image: MOCK_PRODUCT.images[0],
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      maxStock: selectedVariant ? selectedVariant.stock : undefined,
    });
    
    toast_success('Added to cart');
  };

  const currentPrice = selectedVariant ? selectedVariant.price : MOCK_PRODUCT.price;

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <nav className="text-sm text-coal/60 mb-6 hidden md:block">
          <a href="/" className="hover:text-ember">Home</a> &rsaquo; <a href="/category/fashion" className="hover:text-ember">Fashion</a> &rsaquo; <span className="text-coal font-bold">{MOCK_PRODUCT.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-coal/5 border border-coal/10 relative">
              <img 
                src={MOCK_PRODUCT.images[activeImage]} 
                alt={MOCK_PRODUCT.name} 
                className="w-full h-full object-cover"
              />
              {MOCK_PRODUCT.compareAtPrice && (
                <div className="absolute top-4 left-4">
                  <Badge variant="ember">Sale</Badge>
                </div>
              )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {MOCK_PRODUCT.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-ember' : 'border-transparent hover:border-coal/20'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="market-green">Verified Vendor</Badge>
              <a href={`/vendor/${MOCK_PRODUCT.vendorId}`} className="text-sm font-bold text-coal/80 hover:text-ember hover:underline">
                {MOCK_PRODUCT.vendorName}
              </a>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-coal mb-2">{MOCK_PRODUCT.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-gold-dust">
                {'★'.repeat(Math.floor(MOCK_PRODUCT.rating))}
                {'☆'.repeat(5 - Math.floor(MOCK_PRODUCT.rating))}
                <span className="text-coal/60 text-sm ml-2">({MOCK_PRODUCT.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-black text-ember">₦{currentPrice.toLocaleString()}</span>
                {MOCK_PRODUCT.compareAtPrice && (
                  <span className="text-lg text-coal/40 line-through">₦{MOCK_PRODUCT.compareAtPrice.toLocaleString()}</span>
                )}
              </div>
            </div>

            {/* Variants */}
            {MOCK_PRODUCT.variants && MOCK_PRODUCT.variants.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-coal">Select Size</h3>
                  {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
                    <span className="text-xs font-bold text-red-500">Only {selectedVariant.stock} left!</span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {MOCK_PRODUCT.variants.map(variant => {
                    const isSelected = selectedVariant?.id === variant.id;
                    const isOutOfStock = variant.stock === 0;
                    
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={isOutOfStock}
                        className={`
                          py-3 rounded-lg border font-medium text-sm transition-all
                          ${isSelected ? 'border-ember bg-ember/5 text-ember' : 'border-coal/20 text-coal hover:border-coal'}
                          ${isOutOfStock ? 'opacity-40 cursor-not-allowed bg-coal/5 decoration-slice line-through' : ''}
                        `}
                      >
                        {variant.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center bg-paper border border-coal/20 rounded-xl px-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center text-xl text-coal hover:text-ember disabled:opacity-30"
                  disabled={quantity <= 1}
                >-</button>
                <span className="w-8 text-center font-bold text-coal">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(selectedVariant?.stock || 99, quantity + 1))}
                  className="w-10 h-12 flex items-center justify-center text-xl text-coal hover:text-ember disabled:opacity-30"
                  disabled={selectedVariant?.stock === 0 || quantity >= (selectedVariant?.stock || 99)}
                >+</button>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                size="lg" 
                className="flex-1 text-lg shadow-xl shadow-ember/20"
                disabled={selectedVariant?.stock === 0}
              >
                {selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>

            {/* Description */}
            <div className="prose prose-coal max-w-none">
              <h3 className="font-bold text-lg mb-2">Product Description</h3>
              <p className="text-coal/80 leading-relaxed">{MOCK_PRODUCT.description}</p>
            </div>
            
            {/* WhatsApp Share - Mobile Floating, Desktop Inline */}
            <a 
              href={`https://wa.me/?text=Check out ${MOCK_PRODUCT.name} on Fushion: https://fushion.ng/product/${MOCK_PRODUCT.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-market-green text-market-green font-bold hover:bg-market-green/5 transition-colors lg:w-auto lg:px-6"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Share on WhatsApp
            </a>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
