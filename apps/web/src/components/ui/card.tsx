import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-5',
  lg: 'p-6 md:p-8',
};

export function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-coal/5 overflow-hidden
        ${hover ? 'transition-all duration-300 hover:shadow-lg hover:shadow-coal/5 hover:-translate-y-0.5 hover:border-ember/10' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ─── Product Card Variant ────────────────────────────────
interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  vendorName: string;
  rating?: number;
  reviewCount?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  vendorName,
  rating = 0,
  reviewCount = 0,
}: ProductCardProps) {
  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : null;

  return (
    <a
      href={`/product/${slug}`}
      id={`product-card-${id}`}
      className="group block bg-white rounded-xl border border-coal/5 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-coal/5 hover:-translate-y-1 hover:border-ember/10"
    >
      {/* Image */}
      <div className="relative aspect-square bg-paper overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-coal/20">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Discount badge */}
        {discount && discount > 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-ember text-white text-xs font-bold rounded-md">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Vendor */}
        <p className="text-2xs text-market-green font-medium mb-1 truncate">
          {vendorName}
        </p>

        {/* Name */}
        <h3 className="text-sm font-medium text-coal line-clamp-2 mb-2 group-hover:text-ember transition-colors min-h-[2.5rem]">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-ember">
            ₦{price.toLocaleString()}
          </span>
          {compareAtPrice && (
            <span className="text-xs text-coal/40 line-through">
              ₦{compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-gold-dust' : 'text-coal/15'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-2xs text-coal/40">({reviewCount})</span>
          </div>
        )}
      </div>
    </a>
  );
}
