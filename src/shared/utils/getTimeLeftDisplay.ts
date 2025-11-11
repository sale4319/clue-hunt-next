import type { UserStatistics } from "@app/lib/client";

interface TimeLeftDisplayParams {
  stats: UserStatistics | null;
  timerEndDate?: number | null;
}

/**
 * Format timeLeft from milliseconds to HH:MM:SS
 */
function formatTimeLeft(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Get time left display string in HH:MM:SS format
 */
export function getTimeLeftDisplay({
  stats,
  timerEndDate,
}: TimeLeftDisplayParams): string {
  const timeLeftCheck = stats?.timeLeft && stats.timeLeft > 0;

  if (timeLeftCheck) {
    return formatTimeLeft(stats.timeLeft);
  }

  if (timerEndDate) {
    const currentTime = Date.now();
    const timeRemaining = timerEndDate - currentTime;

    if (timeRemaining > 0) {
      return formatTimeLeft(timeRemaining);
    }
  }

  return "00:00:00";
}
