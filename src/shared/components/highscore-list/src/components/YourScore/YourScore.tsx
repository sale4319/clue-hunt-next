"use client";

import React, { useState } from "react";
import { Title } from "clue-hunt-ui";

import type { UserStatistics } from "@app/lib/client";
import { ScoreMessages } from "@app/messages-contract";

import styles from "./YourScore.module.css";

interface YourScoreProps {
  finalScore: number;
  stats: UserStatistics | null;
  timeLeftCheck?: boolean;
  theme?: string;
  timeLeftDisplay?: string;
  completedLevelsCount?: number;
}

export function YourScore({
  finalScore,
  stats,
  timeLeftCheck,
  theme = "dark",
  timeLeftDisplay = "0:00:00",
  completedLevelsCount = 0,
}: YourScoreProps) {
  const [isScoreExpanded, setIsScoreExpanded] = useState(false);

  return (
    <div className={[styles.scoreContainer, styles[theme || "dark"]].join(" ")}>
      <div onClick={() => setIsScoreExpanded(!isScoreExpanded)}>
        <Title
          label={`${ScoreMessages.TITLE} ${finalScore.toLocaleString()} ${
            isScoreExpanded ? "▼" : "▶"
          }`}
          theme={theme}
          className={styles.yourScore}
        />
        {!isScoreExpanded && <div className={styles.scoreColapsed} />}
      </div>

      {isScoreExpanded && (
        <div className={styles.scoreExpanded}>
          <Title
            label="Score Calculation:"
            titleSize="xs"
            theme={theme}
            className={styles.noPadding}
          />
          <div className={styles.scoreExplanationText}>
            Base Score: 14 - (IncorrectAnswers × 0.5 + SkipsUsed × 0.25)
          </div>
          <div className={styles.scoreExplanationText}>
            Final Score: Base score × Total seconds
          </div>
        </div>
      )}
      <Title
        label={`${ScoreMessages.QUIZES_SOLVED}${
          stats?.correctlyCompletedQuizzes || 0
        }/7`}
        titleSize="small"
        theme={theme}
      />
      <Title
        label={`${ScoreMessages.INCORRECT_ANSWERS}${
          stats?.incorrectAnswers || 0
        }`}
        titleSize="small"
        theme={theme}
      />
      <Title
        label={`${ScoreMessages.LEVELS_COMPLETED}${completedLevelsCount}/7`}
        titleSize="small"
        theme={theme}
      />
      <Title
        label={`${ScoreMessages.SKIPS_USED}${stats?.skipButtonClicks || 0}`}
        titleSize="small"
        theme={theme}
      />
      <Title
        label={`${
          timeLeftCheck
            ? ScoreMessages.COMPLETION_TIME
            : ScoreMessages.TIME_LEFT
        }${timeLeftDisplay}`}
        titleSize="small"
        theme={theme}
      />
    </div>
  );
}
