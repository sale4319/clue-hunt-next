import type { UserStatistics } from "@app/lib/client";

export type ScoreBoardProps = {
  theme?: string;
  showSubmitButton: boolean;
  finalScore: number;
  stats: UserStatistics | null;
  timerEndDate?: number;
  timeLeftCheck?: boolean;
  timeLeftDisplay?: string;
  completedLevelsCount?: number;
  refreshTrigger: number;
  onSubmitSuccess: () => void;
};

export type HighscoreListProps = {
  theme?: string;
  limit?: number;
  refreshTrigger?: number;
  showSubmitButton?: boolean;
  finalScore?: number | null;
  stats?: {
    completionTimeInSeconds?: number;
    timeLeft?: number;
    incorrectAnswers?: number;
    skipButtonClicks?: number;
  } | null;
  timerEndDate?: number;
  timeLeftCheck?: boolean;
  onSubmitSuccess?: () => void;
};

export type YourScoreProps = {
  finalScore: number;
  stats: UserStatistics | null;
  timeLeftCheck?: boolean;
  theme?: string;
  timeLeftDisplay?: string;
  completedLevelsCount?: number;
};
