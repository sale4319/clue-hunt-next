"use client";

import React, { useState } from "react";
import { Title } from "clue-hunt-ui";

import { ScoreMessages } from "@app/messages-contract";

import { YourScoreProps } from "../../types";

import styles from "./YourScore.module.css";

export function YourScore({
  finalScore,
  stats,
  timeLeftCheck,
  theme = "dark",
  timeLeftDisplay = "0:00:00",
  completedLevelsCount = 0,
}: YourScoreProps) {
  const [isScoreExpanded, setIsScoreExpanded] = useState(false);
  const penalty =
    (stats?.incorrectAnswers || 0) * 0.5 +
    (stats?.skipButtonClicks || 0) * 0.25;
  const isMultiplierNegated = penalty >= 14;

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
            1. Base Score = 14 - (0 × 0.5 + 0 × 0.25) = 14
          </div>
          <div className={styles.scoreExplanationText}>
            2. Time Multiplier = 2,700 / 2 = 1,350
          </div>
          <div className={styles.scoreExplanationText}>
            3. Final Score = 14 × 1,350 = 18,900
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
        color={isMultiplierNegated ? "red" : undefined}
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
        color={isMultiplierNegated ? "red" : undefined}
      />
      {timeLeftCheck && (
        <Title
          label={`${ScoreMessages.COMPLETION_TIME}${timeLeftDisplay}`}
          titleSize="small"
          theme={theme}
        />
      )}
    </div>
  );
}
