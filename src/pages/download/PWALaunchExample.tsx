import React from 'react';
import LaunchPWAButton from '@/components/LaunchPWAButton';
import { Smartphone, Globe, Download } from 'lucide-react';

/**
 * Example component showing different ways to implement PWA launch functionality
 * This component demonstrates various button styles and configurations
 */
const PWALaunchExample: React.FC = () => {
  return (
    <div className="space-y-6 p-6 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          لیفت لجندز
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          همراه شما در مسیر تناسب اندام
        </p>
      </div>

      {/* Primary Launch Button */}
      <LaunchPWAButton className="w-full text-lg py-4" />

      {/* Custom styled button */}
      <LaunchPWAButton 
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        webUrl="https://pwa.liftlegends.ir/?utm_source=custom_button&utm_medium=web&utm_campaign=pwa_launch"
      >
        <Smartphone size={20} />
        شروع تمرین
      </LaunchPWAButton>

      {/* Compact button */}
      <LaunchPWAButton className="px-4 py-2 text-sm">
        <Globe size={16} />
        باز کردن
      </LaunchPWAButton>

      {/* Installation info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              نصب اپلیکیشن
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              برای بهترین تجربه، اپلیکیشن را روی دستگاه خود نصب کنید. 
              اگر قبلاً نصب کرده‌اید، دکمه بالا مستقیماً اپلیکیشن را باز می‌کند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWALaunchExample;