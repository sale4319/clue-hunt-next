/**
 * Helper to construct route with skip query parameter
 * Used when navigating via skip button to allow access to locked levels
 */
export function getRouteWithSkip(quiz: string, level: string): string {
  return `/${quiz}/${level}?skip=true`;
}
