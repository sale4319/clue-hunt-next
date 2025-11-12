"use client";

import React from "react";

import { HighscoreList } from "./components/HighscoreList/HighscoreList";
import { YourScore } from "./components/YourScore/YourScore";
import { ScoreBoardProps } from "./types";

import styles from "./ScoreBoard.module.css";

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
