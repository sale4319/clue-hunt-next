export function getRoute(quiz: string, level: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH;
  return `${basePath}/${quiz}/${level}`;
}
