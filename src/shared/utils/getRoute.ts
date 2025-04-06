export function getRoute(quiz: string, level: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH}/${quiz}/${level}`;
}
