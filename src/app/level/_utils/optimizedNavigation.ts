/**
 * Optimized utility for faster game transitions
 * Handles state mutations without blocking navigation
 */

/**
 * Completes a level and navigates without waiting for refresh
 * The next page will refresh statistics via useRefreshOnPageShow hook
 */
export const completeAndNavigate = async (
  levelName: string,
  apiCall: () => Promise<unknown>,
  navigate: (path: string) => void,
  navigatePath: string
) => {
  // Fire the API call in the background (don't await)
  apiCall().catch((error) => {
    console.error(`Failed to mark ${levelName} as completed:`, error);
  });

  // Navigate immediately for instant UI feedback
  navigate(navigatePath);
};

/**
 * Skip level without waiting for API response
 * State will sync when user navigates back
 */
export const skipAndNavigate = async (
  apiCall: () => Promise<unknown>,
  navigate: (path: string) => void,
  navigatePath: string
) => {
  // Fire in background
  apiCall().catch((error) => {
    console.error("Failed to record skip:", error);
  });

  // Navigate immediately
  navigate(navigatePath);
};
