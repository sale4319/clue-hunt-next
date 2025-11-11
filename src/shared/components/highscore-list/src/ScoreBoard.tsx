"use client";

import React from "react";

import type { UserStatistics } from "@app/lib/client";

import { HighscoreList } from "./components/HighscoreList/HighscoreList";
import { YourScore } from "./components/YourScore/YourScore";

import styles from "./ScoreBoard.module.css";

interface ScoreBoardProps {
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
}

export function ScoreBoard({
  theme = "dark",
  showSubmitButton,
  finalScore,
  stats,
  timerEndDate,
  timeLeftCheck = false,
  timeLeftDisplay = "0:00:00",
  completedLevelsCount = 0,
  refreshTrigger,
  onSubmitSuccess,
}: ScoreBoardProps) {
  return (
    <div className={styles.scoreBoardsWrapper}>
      <HighscoreList
        theme={theme}
        limit={5}
        refreshTrigger={refreshTrigger}
        showSubmitButton={showSubmitButton}
        finalScore={finalScore}
        stats={stats}
        timerEndDate={timerEndDate}
        timeLeftCheck={timeLeftCheck}
        onSubmitSuccess={onSubmitSuccess}
      />
      <YourScore
        theme={theme}
        finalScore={finalScore}
        stats={stats}
        timeLeftCheck={timeLeftCheck}
        timeLeftDisplay={timeLeftDisplay}
        completedLevelsCount={completedLevelsCount}
      />
    </div>
  );
}
