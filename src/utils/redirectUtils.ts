/**
 * Utility functions for handling redirects after authentication
 */

const REDIRECT_URL_KEY = 'redirectAfterLogin';

/**
 * Store the current URL to redirect to after login
 * @param url - The URL to redirect to after login (optional, defaults to current location)
 */
export const setRedirectUrl = (url?: string) => {
  const redirectUrl = url || window.location.pathname + window.location.search;
  // Don't store login page or home page as redirect URLs
  if (redirectUrl !== '/login' && redirectUrl !== '/') {
    localStorage.setItem(REDIRECT_URL_KEY, redirectUrl);
  }
};

/**
 * Get the stored redirect URL and clear it from storage
 * @returns The stored redirect URL or null if none exists
 */
export const getAndClearRedirectUrl = (): string | null => {
  const redirectUrl = localStorage.getItem(REDIRECT_URL_KEY);
  if (redirectUrl) {
    localStorage.removeItem(REDIRECT_URL_KEY);
    return redirectUrl;
  }
  return null;
};

/**
 * Clear the stored redirect URL without returning it
 */
export const clearRedirectUrl = () => {
  localStorage.removeItem(REDIRECT_URL_KEY);
};

/**
 * Check if a URL requires authentication
 * @param pathname - The pathname to check
 * @returns true if the URL requires authentication
 */
export const requiresAuth = (pathname: string): boolean => {
  const protectedRoutes = [
    '/profile',
    '/dashboard', 
    '/payment',
    '/payment-callback',
    '/subscription'
  ];
  
  return protectedRoutes.some(route => pathname.startsWith(route));
};

/**
 * Get a user-friendly name for a route
 * @param pathname - The pathname to get name for
 * @returns A user-friendly name for the route
 */
export const getRouteName = (pathname: string): string => {
  const routeNames: Record<string, string> = {
    '/profile': 'پروفایل کاربری',
    '/dashboard': 'داشبورد',
    '/payment': 'پرداخت',
    '/payment-callback': 'تایید پرداخت',
    '/subscription': 'اشتراک'
  };
  
  // Find the matching route
  for (const [route, name] of Object.entries(routeNames)) {
    if (pathname.startsWith(route)) {
      return name;
    }
  }
  
  return 'صفحه';
};