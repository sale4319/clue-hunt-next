export function getRoute(lock: boolean, level: string): string {
  const routes: Record<string, { locked: string; unlocked: string }> = {
    start: { locked: "/", unlocked: "/level/one" },
    one: { locked: "/level/one", unlocked: "/level/two" },
  };

  const route = routes[level];
  if (!route) {
    throw new Error(`Invalid level: ${level}`);
  }

  return lock ? route.locked : route.unlocked;
}
