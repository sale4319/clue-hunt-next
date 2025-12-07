import { useEffect } from "react";

/**
 * Hook that refreshes statistics when component mounts or user navigates back via browser.
 * Listens to the 'pageshow' event which fires when the page becomes visible.
 * @param refreshFn - Callback function to call when page becomes visible
 */
export const useRefreshOnPageShow = (refreshFn: () => void) => {
  useEffect(() => {
    const handlePageShow = () => {
      refreshFn();
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [refreshFn]);
};
