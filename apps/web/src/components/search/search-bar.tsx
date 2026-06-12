'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// For Phase 2 UI, we mock the search adapter until Typesense is fully populated
export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto hidden md:block">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => {
            if (query.length > 0) setIsOpen(true);
          }}
          placeholder="Search for products, brands, or categories..."
          className="w-full h-11 pl-4 pr-12 rounded-xl bg-white border-2 border-transparent focus:border-ember outline-none text-coal shadow-sm transition-all"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-coal/40 hover:text-ember bg-transparent border-none cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Instant Search Dropdown Mock */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-coal/10 overflow-hidden z-50">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-bold text-coal/40 uppercase tracking-wider">Top Matches</div>
            <a href="/product/ankara-print-maxi-dress" className="flex items-center gap-3 px-3 py-2 hover:bg-coal/5 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-coal/10 rounded overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1515347619362-717472ba89dd?q=80&w=100&auto=format&fit=crop" alt="Thumbnail" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-coal truncate">Ankara Print Maxi Dress</p>
                <p className="text-xs text-coal/60">in Fashion</p>
              </div>
              <span className="text-sm font-bold text-ember">₦25,000</span>
            </a>
            <a href="/product/shea-butter-lotion" className="flex items-center gap-3 px-3 py-2 hover:bg-coal/5 rounded-lg transition-colors mt-1">
              <div className="w-10 h-10 bg-coal/10 rounded overflow-hidden shrink-0">
                <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=100&auto=format&fit=crop" alt="Thumbnail" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-coal truncate">Shea Butter Lotion</p>
                <p className="text-xs text-coal/60">in Health & Beauty</p>
              </div>
              <span className="text-sm font-bold text-ember">₦5,000</span>
            </a>
          </div>
          <div className="bg-coal/5 p-2 text-center border-t border-coal/10">
            <button onClick={handleSearch} className="text-sm font-bold text-ember hover:underline">
              See all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
