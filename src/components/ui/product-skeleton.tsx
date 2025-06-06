import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-16 rtl:space-x-reverse">
          <div className="h-4 w-12 bg-gray-800 rounded animate-pulse"></div>
          <span className="text-gray-600">/</span>
          <div className="h-4 w-16 bg-gray-800 rounded animate-pulse"></div>
          <span className="text-gray-600">/</span>
          <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          {/* Image Skeleton */}
          <div className="aspect-square w-full rounded-3xl bg-gray-900/50 animate-pulse"></div>

          {/* Content Skeleton */}
          <div className="space-y-12">
            {/* Title */}
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="h-12 w-3/4 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-12 w-1/2 bg-gray-800 rounded animate-pulse"></div>
              </div>
              
              <div className="flex items-center space-x-8 rtl:space-x-reverse">
                <div className="h-8 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-800 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 w-4/6 bg-gray-800 rounded animate-pulse"></div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-5 h-5 bg-gray-800 rounded-full animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-800 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <div className="h-14 w-full bg-gray-800 rounded-2xl animate-pulse"></div>
              <div className="h-12 w-full bg-gray-800 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Specifications Skeleton */}
        <div className="mb-32">
          <div className="h-8 w-48 bg-gray-800 rounded mx-auto mb-16 animate-pulse"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[1, 2].map((section) => (
              <div key={section} className="space-y-8">
                <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="space-y-6">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between items-center py-4">
                      <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
                      <div className="h-4 w-20 bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products Skeleton */}
        <div>
          <div className="h-8 w-40 bg-gray-800 rounded mx-auto mb-16 animate-pulse"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-900/30 rounded-3xl overflow-hidden border border-gray-800/50">
                <div className="aspect-video w-full bg-gray-800 animate-pulse"></div>
                <div className="p-8 space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-1/2 bg-gray-800 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-24 bg-gray-800 rounded animate-pulse"></div>
                    <div className="w-5 h-5 bg-gray-800 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;