import React from 'react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCurrency?: boolean;
  originalPrice?: number;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  className,
  size = 'md',
  showCurrency = true,
  originalPrice
}) => {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={cn("flex items-baseline space-x-2 rtl:space-x-reverse", className)}>
      {originalPrice && originalPrice > price && (
        <span className={cn(
          "text-gray-500 line-through",
          size === 'sm' ? 'text-sm' : 
          size === 'md' ? 'text-lg' : 
          size === 'lg' ? 'text-xl' : 'text-2xl'
        )}>
          {formatPrice(originalPrice)}
          {showCurrency && ' تومان'}
        </span>
      )}
      
      <div className="flex items-baseline space-x-1 rtl:space-x-reverse">
        <span className={cn(
          "font-light text-gold-400",
          sizeClasses[size]
        )}>
          {formatPrice(price)}
        </span>
        {showCurrency && (
          <span className={cn(
            "text-gold-400/80",
            size === 'sm' ? 'text-sm' : 
            size === 'md' ? 'text-lg' : 
            size === 'lg' ? 'text-xl' : 'text-2xl'
          )}>
            تومان
          </span>
        )}
      </div>
      
      {originalPrice && originalPrice > price && (
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {Math.round(((originalPrice - price) / originalPrice) * 100)}% تخفیف
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;