import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center gap-2 text-sm text-gray-400 mb-6 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronLeft className="w-4 h-4 text-gray-600" />}
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-gold-500 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gold-500">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;