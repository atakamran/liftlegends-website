import { useEffect } from 'react';

/**
 * This hook fixes scrolling issues by:
 * 1. Preventing default behavior on all anchor links with href="#"
 * 2. Disabling any automatic scroll restoration
 * 3. Preventing any programmatic scrolling that isn't user-initiated
 */
const useFixScrolling = () => {
  useEffect(() => {
    // Disable history scrollRestoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Find all anchor links with href="#" and prevent their default behavior
    const fixEmptyAnchors = () => {
      const anchors = document.querySelectorAll('a[href="#"]');
      anchors.forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });
    };

    // Fix for iOS Safari and other mobile browsers
    const preventScrollReset = (e: TouchEvent) => {
      // This prevents the browser from doing any native scrolling
      if (e.target && (e.target as HTMLElement).tagName !== 'INPUT' && 
          (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };

    // Run once on mount
    fixEmptyAnchors();

    // Set up a mutation observer to handle dynamically added anchors
    const observer = new MutationObserver(() => {
      fixEmptyAnchors();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Add event listener for touchmove with passive: false to allow preventDefault
    document.addEventListener('touchmove', preventScrollReset, { passive: false });

    // Clean up
    return () => {
      observer.disconnect();
      document.removeEventListener('touchmove', preventScrollReset);
    };
  }, []);
};

export default useFixScrolling;