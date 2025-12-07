"use client";

import { useEffect, useRef } from "react";

/**
 * Hook that refreshes statistics when user navigates back via browser or page becomes visible.
 * Uses visibilitychange event which is more reliable than pageshow.
 * @param refreshFn - Callback function to call when page becomes visible
 */
export const useRefreshOnPageShow = (refreshFn: () => void) => {
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only add listeners if window is available (client-side)
    if (typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      // Refresh when page becomes visible
      if (document.visibilityState === "visible") {
        refreshFn();
      }
    };

    const handlePageShow = () => {
      refreshFn();
    };

    // Add both listeners for better coverage
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // If page is already visible on mount, refresh immediately
    if (!hasInitialized.current && document.visibilityState === "visible") {
      hasInitialized.current = true;
      refreshFn();
    }

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshFn]);
};
