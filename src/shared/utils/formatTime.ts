export const twoDigits = (num: number) => String(num).padStart(2, "0");

export const formatTimeFromMs = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
};

export const calculateFrozenTime = (
  frozenTimeLeft: number | null,
  stats: { timeLeft?: number; completionTimeInSeconds?: number } | null
): number => {
  if (frozenTimeLeft !== null && frozenTimeLeft >= 0) return frozenTimeLeft;
  if (stats?.timeLeft && stats.timeLeft > 0) return stats.timeLeft;
  if (stats?.completionTimeInSeconds && stats.completionTimeInSeconds > 0) {
    return Math.max(0, 2 * 3600 - stats.completionTimeInSeconds) * 1000;
  }
  return 0;
};
