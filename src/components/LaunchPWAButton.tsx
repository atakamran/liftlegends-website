import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Globe, Loader2 } from 'lucide-react';
import { isPWAInstalled, launchPWAOrRedirect, DEFAULT_WEB_URL } from '@/utils/pwaUtils';
import { cn } from '@/lib/utils';

export interface LaunchPWAButtonProps {
  /** Custom CSS classes */
  className?: string;
  /** Custom web URL to open if PWA is not installed */
  webUrl?: string;
  /** Fallback URL if main URL fails */
  fallbackUrl?: string;
  /** Button content - can be text or JSX elements */
  children?: React.ReactNode;
  /** Show loading state */
  showLoading?: boolean;
  /** Show PWA status indicator */
  showStatus?: boolean;
  /** Custom button variant */
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Disabled state */
  disabled?: boolean;
  /** Click handler override */
  onClick?: () => void;
}

/**
 * Smart PWA Launch Button Component
 * Automatically detects if PWA is installed and shows appropriate button text and icon
 * Launches PWA directly if installed, otherwise opens web version
 */
const LaunchPWAButton: React.FC<LaunchPWAButtonProps> = ({
  className,
  webUrl = DEFAULT_WEB_URL,
  fallbackUrl,
  children,
  showLoading = true,
  showStatus = true,
  variant = 'default',
  size = 'default',
  disabled = false,
  onClick
}) => {
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  useEffect(() => {
    checkInstallation();
  }, []);

  const checkInstallation = async () => {
    try {
      setIsLoading(true);
      const installed = await isPWAInstalled();
      setIsInstalled(installed);
    } catch (error) {
      console.error('Error checking PWA installation:', error);
      setIsInstalled(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = async () => {
    if (onClick) {
      onClick();
      return;
    }

    try {
      setIsLaunching(true);
      await launchPWAOrRedirect({ webUrl, fallbackUrl });
    } catch (error) {
      console.error('Error launching PWA:', error);
      // Fallback to opening web URL
      window.open(webUrl, '_blank');
    } finally {
      setIsLaunching(false);
    }
  };

  const getButtonContent = () => {
    if (children) {
      return children;
    }

    if (isLoading && showLoading) {
      return (
        <>
          <Loader2 className="w-5 h-5 ml-2 animate-spin" />
          در حال بررسی...
        </>
      );
    }

    if (isLaunching) {
      return (
        <>
          <Loader2 className="w-5 h-5 ml-2 animate-spin" />
          در حال باز کردن...
        </>
      );
    }

    return (
      <>
        {isInstalled ? (
          <ExternalLink className="w-5 h-5 ml-2" />
        ) : (
          <Globe className="w-5 h-5 ml-2" />
        )}
        {isInstalled ? 'ورود به برنامه' : 'ورود به برنامه'}
      </>
    );
  };

  const getButtonClasses = () => {
    const baseClasses = "transition-all duration-300 hover:scale-105";
    
    if (isInstalled) {
      return cn(
        baseClasses,
        "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-green-500/25",
        className
      );
    }

    return cn(
      baseClasses,
      "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25",
      className
    );
  };

  return (
    <div className="space-y-2">
      <Button
        className={getButtonClasses()}
        variant={variant}
        size={size}
        disabled={disabled || isLoading || isLaunching}
        onClick={handleClick}
      >
        {getButtonContent()}
      </Button>

      {/* PWA Status Indicator */}
      {showStatus && isInstalled && !isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>اپلیکیشن نصب شده</span>
        </div>
      )}
    </div>
  );
};

export default LaunchPWAButton;