import type { UserStatistics } from "@app/lib/client";

interface ScoreCalculationParams {
  stats: UserStatistics | null;
  timerEndDate?: number | null;
  timeLeftCheck?: boolean;
  isTimerStarted?: boolean;
  initialTimerDuration?: number; // Add initial timer duration parameter
}

/**
 * Calculate score using the formula: (14 - (incorrectAnswers * 0.5 + skipsUsed * 0.25)) * completionTimeInSeconds
 */
export function calculateScore({
  stats,
  timerEndDate,
  timeLeftCheck,
  isTimerStarted = true,
  initialTimerDuration,
}: ScoreCalculationParams): number {
  const incorrectAnswers = stats?.incorrectAnswers || 0;
  const skipsUsed = stats?.skipButtonClicks || 0;

  // Check if all levels and quizzes are completed
  const completedQuizzes = stats?.correctlyCompletedQuizzes || 0;
  const completedLevelsCount = stats?.completedLevelsMap
    ? Object.values(stats.completedLevelsMap).filter((val) => val === true)
        .length
    : 0;

  const totalQuizzes = 7;
  const totalLevels = 7;
  const allCompleted =
    completedQuizzes >= totalQuizzes && completedLevelsCount >= totalLevels;

  // If not all levels and quizzes are completed, return 0
  if (!allCompleted) {
    return 0;
  }

  // Calculate completion time in seconds
  let completionTimeInSeconds = 0;

  // Priority 1: Use stored time left (time remaining when game was completed)
  if (stats?.gameCompletedAt && stats?.timeLeft && stats.timeLeft > 0) {
    // Use time remaining when game was completed (rewards faster completion)
    completionTimeInSeconds = Math.floor(stats.timeLeft / 1000);
  } else if (stats?.gameCompletedAt && stats?.completionTimeInSeconds) {
    // Fallback: Use stored completion time if timeLeft not available
    completionTimeInSeconds = stats.completionTimeInSeconds;
  } else if (!isTimerStarted) {
    // If timer hasn't started, use 0 seconds
    completionTimeInSeconds = 0;
  } else if (timeLeftCheck && stats?.timeLeft) {
    // Game completed: use time remaining directly (rewards faster completion)
    completionTimeInSeconds = Math.floor(stats.timeLeft / 1000);
  } else if (timerEndDate) {
    // Game not completed: calculate time already elapsed
    const currentTime = Date.now();
    const timeRemainingMs = Math.max(0, timerEndDate - currentTime);
    // Time used = original duration - time remaining (estimate original as 2h)
    const timeUsedMs = 2 * 60 * 60 * 1000 - timeRemainingMs;
    completionTimeInSeconds = Math.max(0, Math.floor(timeUsedMs / 1000));
  } else {
    // No timer data, use a default time
    completionTimeInSeconds = 3600; // 1 hour
  }

  // Apply the difficulty-based scoring formula
  const penalty = incorrectAnswers * 0.5 + skipsUsed * 0.25;
  const baseScore = Math.max(0, 14 - penalty);

  // Calculate time multiplier based on difficulty and remaining time
  let timeMultiplier = 0;

  if (completionTimeInSeconds > 0) {
    // Determine difficulty from initial timer duration or estimate from remaining time
    let difficultyMinutes = initialTimerDuration
      ? initialTimerDuration / 60
      : null;

    // If no initial duration provided, estimate from completion data
    if (!difficultyMinutes && stats?.gameCompletedAt) {
      // Estimate difficulty based on typical completion patterns
      if (completionTimeInSeconds > 1800) {
        // > 30 minutes remaining suggests 1h (60min) game
        difficultyMinutes = 60;
      } else if (completionTimeInSeconds > 900) {
        // > 15 minutes remaining suggests 30min game
        difficultyMinutes = 30;
      } else {
        difficultyMinutes = 15; // <= 15 minutes remaining suggests 15min game
      }
    }

    // Apply difficulty-based time multiplier
    if (difficultyMinutes === 60) {
      // 1 hour (Easy): remaining time / 2
      timeMultiplier = completionTimeInSeconds / 2;
    } else if (difficultyMinutes === 30) {
      // 30 minutes (Normal): remaining time / 1 (no division)
      timeMultiplier = completionTimeInSeconds;
    } else {
      // 15 minutes (Hard): remaining time * 4
      timeMultiplier = completionTimeInSeconds * 4;
    }
  }

  const finalScore = baseScore * timeMultiplier;

  console.log("Score calculation debug:", {
    incorrectAnswers,
    skipsUsed,
    penalty,
    baseScore,
    completionTimeInSeconds,
    initialTimerDuration,
    estimatedDifficulty: initialTimerDuration
      ? `${initialTimerDuration / 60} minutes`
      : "estimated",
    timeMultiplier,
    finalScore,
    allCompleted,
    isTimerStarted,
    hasGameCompletedAt: !!stats?.gameCompletedAt,
    hasStoredCompletionTime: !!stats?.completionTimeInSeconds,
  });

  return Math.round(finalScore);
}

/**
 * Get the completion time in seconds for display purposes
 */
export function getCompletionTimeInSeconds({
  stats,
  timerEndDate,
  timeLeftCheck,
}: ScoreCalculationParams): number {
  if (timeLeftCheck && stats?.timeLeft) {
    const timeUsedMs = Math.max(0, 4 * 60 * 60 * 1000 - stats.timeLeft);
    return Math.floor(timeUsedMs / 1000);
  } else if (timerEndDate) {
    const currentTime = Date.now();
    const timeRemainingMs = Math.max(0, timerEndDate - currentTime);
    const timeUsedMs = 2 * 60 * 60 * 1000 - timeRemainingMs;
    return Math.max(0, Math.floor(timeUsedMs / 1000));
  } else {
    return 3600; // 1 hour default
  }
}
