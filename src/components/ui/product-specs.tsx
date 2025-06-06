import React from 'react';
import { cn } from '@/lib/utils';

interface SpecItem {
  label: string;
  value: string;
}

interface ProductSpecsProps {
  specs: SpecItem[];
  title: string;
  className?: string;
}

const ProductSpecs: React.FC<ProductSpecsProps> = ({
  specs,
  title,
  className
}) => {
  return (
    <div className={cn("space-y-8", className)}>
      <h3 className="text-xl font-light text-gold-400 mb-6">{title}</h3>
      <div className="space-y-6">
        {specs.map((spec, index) => (
          <div 
            key={index}
            className="flex justify-between items-center py-4 border-b border-gray-800/50 hover:border-gray-700/50 transition-colors duration-300 group"
          >
            <span className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              {spec.label}
            </span>
            <span className="text-white font-light group-hover:text-gold-400 transition-colors duration-300">
              {spec.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecs;