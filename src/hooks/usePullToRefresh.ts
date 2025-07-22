import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 2.5,
  enabled = true
}: PullToRefreshOptions) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    let rafId: number;

    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger if we're at the top of the page and scrolling up
      if (window.scrollY > 0) return;
      
      startY.current = e.touches[0].clientY;
      isDragging.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY > 0) return;
      
      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      // Only proceed if pulling down
      if (deltaY <= 0) {
        if (isPulling) {
          setIsPulling(false);
          setPullDistance(0);
        }
        return;
      }

      // Prevent default scrolling when pulling down at the top
      if (deltaY > 10) {
        e.preventDefault();
        isDragging.current = true;
        
        // Calculate pull distance with resistance
        const distance = Math.min(deltaY / resistance, threshold * 1.5);
        
        if (!isPulling && distance > 10) {
          setIsPulling(true);
        }
        
        setPullDistance(distance);
      }
    };

    const handleTouchEnd = async () => {
      if (!isDragging.current || !isPulling) {
        setIsPulling(false);
        setPullDistance(0);
        return;
      }

      isDragging.current = false;

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh failed:', error);
        } finally {
          setIsRefreshing(false);
          setIsPulling(false);
          setPullDistance(0);
        }
      } else {
        // Animate back to original position
        const animateBack = () => {
          setPullDistance(prev => {
            const newDistance = prev * 0.8;
            if (newDistance < 1) {
              setIsPulling(false);
              return 0;
            }
            rafId = requestAnimationFrame(animateBack);
            return newDistance;
          });
        };
        animateBack();
      }
    };

    // Add event listeners with passive: false to allow preventDefault
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [enabled, threshold, resistance, onRefresh, isPulling, isRefreshing, pullDistance]);

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    shouldShowRefreshIndicator: isPulling || isRefreshing
  };
};