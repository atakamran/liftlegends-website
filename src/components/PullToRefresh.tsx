import React from "react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: React.ReactNode;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
  className?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  threshold = 80,
  resistance = 2.5,
  enabled = true,
  className = "",
}) => {
  const {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    shouldShowRefreshIndicator,
  } = usePullToRefresh({
    onRefresh,
    threshold,
    resistance,
    enabled,
  });

  const refreshProgress = Math.min(pullDistance / threshold, 1);
  const shouldTrigger = refreshProgress >= 1;

  return (
    <div
      ref={containerRef}
      className={`relative pull-to-refresh-container ${className}`}
      style={{
        transform: isPulling
          ? `translateY(${Math.min(pullDistance, threshold)}px)`
          : "none",
        transition: isPulling ? "none" : "transform 0.3s ease-out",
      }}
    >
      {/* Pull to refresh indicator */}
      {shouldShowRefreshIndicator && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-50"
          style={{
            transform: `translateY(-${Math.max(60 - pullDistance, 0)}px)`,
            opacity: Math.min(pullDistance / 40, 1),
          }}
        >
          <div className="bg-black/80 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-800">
            <RefreshCw
              className={`w-6 h-6 text-yellow-400 ${
                isRefreshing
                  ? "animate-spin"
                  : shouldTrigger
                  ? "rotate-180"
                  : ""
              }`}
              style={{
                transform:
                  !isRefreshing && !shouldTrigger
                    ? `rotate(${refreshProgress * 180}deg)`
                    : undefined,
                transition:
                  isRefreshing || shouldTrigger
                    ? "none"
                    : "transform 0.1s ease-out",
              }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Pull instruction text */}
      {isPulling && !isRefreshing && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-40"
          style={{
            transform: `translateY(-${Math.max(30 - pullDistance, 0)}px)`,
            opacity: Math.min(pullDistance / 40, 0.7),
          }}
        >
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1 mt-16">
            <p className="text-white text-sm font-medium">
              {shouldTrigger
                ? "رها کنید تا بروزرسانی شود"
                : "برای بروزرسانی پایین بکشید"}
            </p>
          </div>
        </div>
      )}

      {/* Refreshing text */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center z-40 mt-16">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
            <p className="text-white text-sm font-medium">
              در حال بروزرسانی...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PullToRefresh;
