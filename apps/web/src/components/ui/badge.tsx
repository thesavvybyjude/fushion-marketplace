type BadgeVariant = 'default' | 'ember' | 'green' | 'gold' | 'coal' | 'red';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-coal/10 text-coal',
  ember: 'bg-ember/10 text-ember',
  green: 'bg-market-green/10 text-market-green',
  gold: 'bg-gold-dust/10 text-gold-dust-700',
  coal: 'bg-coal text-white',
  red: 'bg-red-100 text-red-700',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-2xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === 'green'
              ? 'bg-market-green'
              : variant === 'ember'
                ? 'bg-ember'
                : variant === 'gold'
                  ? 'bg-gold-dust'
                  : variant === 'red'
                    ? 'bg-red-500'
                    : 'bg-coal'
          }`}
        />
      )}
      {children}
    </span>
  );
}
