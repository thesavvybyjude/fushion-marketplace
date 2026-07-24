'use client';

import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
    icon: (active: boolean) => <Home size={20} strokeWidth={active ? 2.5 : 2} />,
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: (active: boolean) => <LayoutGrid size={20} strokeWidth={active ? 2.5 : 2} />,
  },
  {
    label: 'Search',
    href: '/search',
    icon: (active: boolean) => <Search size={20} strokeWidth={active ? 2.5 : 2} />,
  },
  {
    label: 'Cart',
    href: '/cart',
    icon: (active: boolean) => <ShoppingBag size={20} strokeWidth={active ? 2.5 : 2} />,
  },
  {
    label: 'Account',
    href: '/account',
    icon: (active: boolean) => <User size={20} strokeWidth={active ? 2.5 : 2} />,
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-coal/10 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const isCart = item.label === 'Cart';
          const showBadge = isCart && mounted && totalItems > 0;

          return (
            <a
              key={item.href}
              href={item.href}
              id={`mobile-nav-${item.label.toLowerCase()}`}
              className={`
                flex flex-col items-center justify-center gap-0.5 w-14 h-full relative
                transition-colors duration-200
                ${isActive ? 'text-ember' : 'text-coal/40 hover:text-coal/70'}
              `}
            >
              {isCart && showBadge && (
                <span className="absolute -top-0.5 right-1 bg-ember text-white text-2xs font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              {item.icon(isActive)}
              <span className="text-2xs font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
