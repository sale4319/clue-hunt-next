/**
 * Helper to construct route with progress query parameter
 * Used when navigating through natural game progression (level/quiz completion)
 * to distinguish from skip button usage
 */
export function getRouteWithProgress(quiz: string, level: string): string {
  return `/${quiz}/${level}?progress=true`;
}
