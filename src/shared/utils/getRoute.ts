export function getRoute(lock: boolean, quiz: string, level: string): string {
  const nextRoute = `/${quiz}/${level}`;

  return lock ? "" : nextRoute;
}
