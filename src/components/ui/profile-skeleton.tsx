import React from 'react';

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-16">
          <div className="h-10 w-48 bg-gray-800 rounded animate-pulse"></div>
          <div className="h-8 w-24 bg-gray-800 rounded mt-4 md:mt-0 animate-pulse"></div>
        </div>

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* User Info Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/30 rounded-3xl p-8 space-y-8">
              {/* Avatar */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 bg-gray-800 rounded-full animate-pulse"></div>
                <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-48 bg-gray-800 rounded animate-pulse"></div>
              </div>

              {/* Info Items */}
              <div className="space-y-6">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Subscription Card */}
              <div className="bg-gray-800/50 rounded-2xl p-6 space-y-4">
                <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-2 w-full bg-gray-800 rounded animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Edit Form Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/30 rounded-3xl p-8 space-y-8">
              {/* Header */}
              <div className="space-y-2">
                <div className="h-8 w-40 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-64 bg-gray-800 rounded animate-pulse"></div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 rtl:space-x-reverse">
                <div className="h-10 w-32 bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-800 rounded-lg animate-pulse"></div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-12 w-full bg-gray-800 rounded-lg animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Goal Selection */}
              <div className="space-y-4">
                <div className="h-6 w-32 bg-gray-800 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-32 bg-gray-800 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <div className="h-12 w-32 bg-gray-800 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;