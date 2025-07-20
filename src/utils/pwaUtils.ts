/**
 * PWA Utilities for Lift Legends
 * Provides functions to detect PWA installation and launch PWA or redirect to web version
 */

export interface PWALaunchOptions {
  webUrl?: string;
  fallbackUrl?: string;
}

/**
 * Default web URL for Lift Legends
 */
export const DEFAULT_WEB_URL = "https://app.liftlegends.ir/?utm_source=download_page&utm_medium=web&utm_campaign=pwa_launch";

/**
 * Check if PWA is installed using multiple detection methods
 * @returns Promise<boolean> - true if PWA is likely installed
 */
export const isPWAInstalled = async (): Promise<boolean> => {
  // Method 1: Check if running in standalone mode (PWA is launched)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Method 2: Check if navigator.standalone is true (iOS Safari)
  if ((window.navigator as any).standalone === true) {
    return true;
  }

  // Method 3: Use getInstalledRelatedApps API (Chrome 80+)
  if ('getInstalledRelatedApps' in navigator) {
    try {
      const relatedApps = await (navigator as any).getInstalledRelatedApps();
      if (relatedApps && relatedApps.length > 0) {
        return true;
      }
    } catch (error) {
      console.log('getInstalledRelatedApps not available or failed:', error);
    }
  }

  // Method 4: Check for PWA-specific features and context
  if ('serviceWorker' in navigator) {
    // Check if we're in a PWA context by looking at various indicators
    const isLikelyPWA = window.location.search.includes('utm_source=pwa') || 
                       document.referrer.includes('android-app://') ||
                       document.referrer.includes('ios-app://') ||
                       window.location.search.includes('source=pwa');
    
    if (isLikelyPWA) {
      return true;
    }
  }

  // Method 5: Check localStorage for PWA installation flag (if the PWA sets one)
  try {
    const pwaInstalled = localStorage.getItem('pwa-installed');
    if (pwaInstalled === 'true') {
      return true;
    }
  } catch (error) {
    // localStorage might not be available
    console.log('localStorage check failed:', error);
  }

  return false;
};

/**
 * Launch PWA if installed, otherwise redirect to web version
 * @param options - Configuration options for launch behavior
 */
export const launchPWAOrRedirect = async (options: PWALaunchOptions = {}): Promise<void> => {
  const { webUrl = DEFAULT_WEB_URL, fallbackUrl } = options;
  const userAgent = navigator.userAgent.toLowerCase();
  const isInstalled = await isPWAInstalled();
  
  // If we're already in PWA mode, just navigate within the app
  if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
    window.location.href = webUrl;
    return;
  }
  
  // Try platform-specific PWA launch methods if installed
  if (isInstalled) {
    const launched = await tryPWALaunch(webUrl, userAgent);
    if (launched) {
      return;
    }
  }

  // Fallback: Open regular URL
  const finalUrl = fallbackUrl || webUrl;
  const newWindow = window.open(finalUrl, '_blank');
  
  // Focus the new window if popup blocker didn't block it
  if (newWindow) {
    newWindow.focus();
  }
};

/**
 * Try to launch PWA using platform-specific methods
 * @param pwaUrl - URL to launch
 * @param userAgent - User agent string
 * @returns Promise<boolean> - true if launch was attempted
 */
const tryPWALaunch = async (pwaUrl: string, userAgent: string): Promise<boolean> => {
  // Android Chrome - Try intent URL
  if (userAgent.includes('android') && userAgent.includes('chrome')) {
    try {
      // Create intent URL that will try to open the PWA if installed
      const intentUrl = `intent://${pwaUrl.replace('https://', '')}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(pwaUrl)};end`;
      
      // Try to launch with intent
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = intentUrl;
      document.body.appendChild(iframe);
      
      // Clean up iframe after a short delay
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
      
      return true;
    } catch (error) {
      console.log('Android intent launch failed:', error);
    }
  }
  
  // iOS Safari - Limited options, but try app-specific URL scheme if available
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    try {
      // iOS doesn't provide a reliable way to launch PWA directly
      // The best we can do is open the URL and let iOS handle it
      const pwaUrlWithParam = `${pwaUrl}?source=pwa&utm_source=download_page`;
      window.open(pwaUrlWithParam, '_blank');
      return true;
    } catch (error) {
      console.log('iOS launch failed:', error);
    }
  }

  // Desktop Chrome/Edge - Try custom protocol if available
  if (userAgent.includes('chrome') || userAgent.includes('edge')) {
    try {
      // Try custom protocol handler
      window.location.href = "web+liftlegends://launch";
      return true;
    } catch (error) {
      console.log('Custom protocol launch failed:', error);
    }
  }
  
  return false;
};

/**
 * Get PWA installation status with detailed information
 * @returns Promise<object> - Detailed installation status
 */
export const getPWAStatus = async () => {
  const isInstalled = await isPWAInstalled();
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  const hasServiceWorker = 'serviceWorker' in navigator;
  const hasRelatedApps = 'getInstalledRelatedApps' in navigator;

  return {
    isInstalled,
    isStandalone,
    isIOSStandalone,
    hasServiceWorker,
    hasRelatedApps,
    userAgent: navigator.userAgent,
    displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'
  };
};

/**
 * Add PWA installation event listeners
 * @param onInstallPrompt - Callback for install prompt
 * @param onInstalled - Callback for successful installation
 */
export const addPWAEventListeners = (
  onInstallPrompt?: (event: any) => void,
  onInstalled?: () => void
) => {
  // Listen for beforeinstallprompt event
  if (onInstallPrompt) {
    window.addEventListener('beforeinstallprompt', onInstallPrompt);
  }

  // Listen for appinstalled event
  if (onInstalled) {
    window.addEventListener('appinstalled', onInstalled);
  }

  // Return cleanup function
  return () => {
    if (onInstallPrompt) {
      window.removeEventListener('beforeinstallprompt', onInstallPrompt);
    }
    if (onInstalled) {
      window.removeEventListener('appinstalled', onInstalled);
    }
  };
};