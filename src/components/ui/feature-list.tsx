import React from 'react';
import { CheckCircle, Clock, Shield, Zap, Users, Award, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ReactNode;
  text: string;
  color: string;
}

interface FeatureListProps {
  className?: string;
  layout?: 'grid' | 'list';
}

const FeatureList: React.FC<FeatureListProps> = ({
  className,
  layout = 'grid'
}) => {
  const features: Feature[] = [
    {
      icon: <Zap className="w-5 h-5" />,
      text: 'دسترسی فوری پس از خرید',
      color: 'text-yellow-400'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: 'پشتیبانی ۳ ماهه رایگان',
      color: 'text-blue-400'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      text: 'بروزرسانی مادام‌العمر',
      color: 'text-orange-400'
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: 'برنامه شخصی‌سازی شده',
      color: 'text-green-400'
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: 'تضمین کیفیت محتوا',
      color: 'text-red-400'
    },
    {
      icon: <Headphones className="w-5 h-5" />,
      text: 'پشتیبانی ۲۴/۷',
      color: 'text-cyan-400'
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      text: 'تضمین بازگشت وجه',
      color: 'text-emerald-400'
    }
  ];

  const gridClasses = layout === 'grid' 
    ? 'grid grid-cols-2 gap-6' 
    : 'space-y-4';

  return (
    <div className={cn(gridClasses, className)}>
      {features.map((feature, index) => (
        <div 
          key={index}
          className="flex items-center space-x-3 rtl:space-x-reverse group hover:bg-gray-800/30 p-3 rounded-lg transition-all duration-300"
        >
          <div className={cn(
            'flex-shrink-0 transition-colors duration-300',
            feature.color
          )}>
            {feature.icon}
          </div>
          <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
            {feature.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeatureList;