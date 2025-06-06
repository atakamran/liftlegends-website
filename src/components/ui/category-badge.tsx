import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: 'training' | 'diet' | 'supplement';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  className,
  size = 'md'
}) => {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'training':
        return 'برنامه تمرینی';
      case 'diet':
        return 'برنامه غذایی';
      case 'supplement':
        return 'مکمل';
      default:
        return cat;
    }
  };

  const getCategoryConfig = (cat: string) => {
    switch (cat) {
      case 'training':
        return {
          color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
          icon: '🏋️'
        };
      case 'diet':
        return {
          color: 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20',
          icon: '🥗'
        };
      case 'supplement':
        return {
          color: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
          icon: '💊'
        };
      default:
        return {
          color: 'bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20',
          icon: '📦'
        };
    }
  };

  const config = getCategoryConfig(category);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  return (
    <Badge 
      className={cn(
        config.color,
        'border backdrop-blur-sm transition-all duration-300 flex items-center space-x-1.5 rtl:space-x-reverse',
        sizeClasses[size],
        className
      )}
    >
      <span>{config.icon}</span>
      <span>{getCategoryLabel(category)}</span>
    </Badge>
  );
};

export default CategoryBadge;