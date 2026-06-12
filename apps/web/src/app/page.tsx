import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Button, ProductCard } from '@/components/ui';

// In a real app, this would be fetched from the API
const MOCK_CATEGORIES = [
  { id: '1', name: 'Electronics', slug: 'electronics', icon: '💻' },
  { id: '2', name: 'Fashion', slug: 'fashion', icon: '👕' },
  { id: '3', name: 'Home & Living', slug: 'home', icon: '🏠' },
  { id: '4', name: 'Health & Beauty', slug: 'health', icon: '✨' },
];

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Infinix Zero 30 5G',
    slug: 'infinix-zero-30-5g',
    price: 350000,
    vendorName: 'Gadget Hub',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Ankara Print Maxi Dress',
    slug: 'ankara-print-maxi-dress',
    price: 25000,
    vendorName: 'Lagos Styles',
    image: 'https://images.unsplash.com/photo-1515347619362-717472ba89dd?q=80&w=500&auto=format&fit=crop',
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Aiye Leather Shoes',
    slug: 'aiye-leather-shoes',
    price: 45000,
    vendorName: 'Shoe Maker',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=500&auto=format&fit=crop',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Shea Butter Lotion',
    slug: 'shea-butter-lotion',
    price: 5000,
    vendorName: 'Naturals By Ngozi',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop',
    rating: 4.7,
  }
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Header />

      <main className="flex-1 w-full pb-20 md:pb-0">
        
        {/* Hero Section */}
        <section className="bg-coal text-white py-16 px-4 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold tracking-wider text-market-green mb-6 border border-white/10 backdrop-blur-sm">
                NIGERIA'S PREMIER MARKETPLACE
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Every market.<br/>
                <span className="text-ember">One place.</span>
              </h1>
              <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto md:mx-0">
                Shop from thousands of verified local vendors across Nigeria. Secure payments, fast delivery, authentic products.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">Start Shopping</Button>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg bg-white/5 border-white/20 text-white hover:bg-white/10">Become a Vendor</Button>
              </div>
            </div>
            <div className="flex-1 hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <img src={MOCK_PRODUCTS[0].image} className="w-full h-64 object-cover rounded-2xl transform -translate-y-4" alt="Product" />
                <img src={MOCK_PRODUCTS[1].image} className="w-full h-64 object-cover rounded-2xl transform translate-y-8" alt="Product" />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-coal mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MOCK_CATEGORIES.map(category => (
              <a key={category.id} href={`/category/${category.slug}`} className="bg-white p-6 rounded-2xl border border-coal/5 text-center hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="font-bold text-coal">{category.name}</h3>
              </a>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-coal">Featured Picks</h2>
              <p className="text-coal/60">Top rated products from trusted vendors</p>
            </div>
            <a href="/search" className="hidden md:inline-flex text-ember font-bold hover:underline">View All</a>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {MOCK_PRODUCTS.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                vendorName={product.vendorName}
                imageUrl={product.image}
                rating={product.rating}
              />
            ))}
          </div>
        </section>

        {/* Value Props */}
        <section className="bg-coal/5 py-16 px-4 mt-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-market-green/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>
              <h3 className="font-bold text-coal mb-2">Secure Payments</h3>
              <p className="text-sm text-coal/70">Powered by Paystack. Your money is safe until you receive your order.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-ember/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚚</div>
              <h3 className="font-bold text-coal mb-2">Fast Delivery</h3>
              <p className="text-sm text-coal/70">Nationwide delivery within 2-5 working days across Nigeria.</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-gold-dust/20 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✨</div>
              <h3 className="font-bold text-coal mb-2">Verified Vendors</h3>
              <p className="text-sm text-coal/70">Every vendor undergoes strict verification before they can sell.</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
