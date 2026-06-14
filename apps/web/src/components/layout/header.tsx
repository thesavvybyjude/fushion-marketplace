'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '../search/search-bar';
import { useCartStore } from '@/stores/cart.store';
import { Search, ShoppingBag } from 'lucide-react';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartStore = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = mounted ? cartStore.getTotalItems() : 0;

  return (
    <header className={`sticky top-0 z-40 bg-coal border-b transition-all ${isScrolled ? 'border-white/10' : 'border-white/5'}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <a href="/" id="header-logo" className="flex items-center shrink-0">
            <span className="text-xl font-bold text-white">
              Fu<span className="text-ember">sh</span>ion
            </span>
          </a>

          {/* Desktop Search (Center) */}
          <div className="flex-1 max-w-2xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop Actions (Right) */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={2} />
            </button>

            {/* Cart */}
            <a
              href="/cart"
              id="header-cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              {/* Cart count badge — uncomment when cart store is active */}
              {/* <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-ember text-white text-2xs font-bold rounded-full flex items-center justify-center">3</span> */}
            </a>

            {/* Auth */}
            <a
              href="/login"
              id="header-login"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              Sign In
            </a>
            <a
              href="/register"
              id="header-register"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium bg-ember text-white rounded-lg hover:bg-ember-600 transition-colors"
            >
              Register
            </a>
          </div>
        </div>

        {/* Mobile Search — Expanded */}
        {searchOpen && (
          <div className="md:hidden pb-3 animate-slide-down">
            <div className="relative">
              <input
                type="text"
                id="mobile-search"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 text-white text-sm rounded-lg border border-white/10 placeholder:text-white/40 focus:outline-none focus:bg-white/15 focus:border-ember/50 transition-all"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} strokeWidth={2} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
