"use client";
import React, { useEffect, useState } from "react";
import cx from "classnames";
import { Button, Title } from "clue-hunt-ui";
import { ScoreMessages } from "src/shared/contracts/messages-contract/src/scoreMessages";

import { type Highscore, highscoreApi } from "@app/lib/client";

import { HighscoreListProps } from "../../types";

import styles from "./HighscoreList.module.css";

export function HighscoreList({
  theme = "dark",
  limit = 10,
  refreshTrigger = 0,
  showSubmitButton = false,
  finalScore = null,
  stats = null,
  timerEndDate,
  timeLeftCheck = false,
  onSubmitSuccess,
}: HighscoreListProps) {
  const [highscores, setHighscores] = useState<Highscore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitHighscore = async () => {
    try {
      let completionTimeInSeconds = 0;

      if (stats?.completionTimeInSeconds) {
        completionTimeInSeconds = stats.completionTimeInSeconds;
      } else if (timeLeftCheck && stats?.timeLeft) {
        const timeUsedMs = Math.max(0, 4 * 60 * 60 * 1000 - stats.timeLeft);
        completionTimeInSeconds = Math.floor(timeUsedMs / 1000);
      } else if (timerEndDate) {
        const currentTime = Date.now();
        const timeRemainingMs = Math.max(0, timerEndDate - currentTime);
        const timeUsedMs = 2 * 60 * 60 * 1000 - timeRemainingMs;
        completionTimeInSeconds = Math.max(0, Math.floor(timeUsedMs / 1000));
      } else {
        completionTimeInSeconds = 3600;
      }

      await highscoreApi.submitHighscore({
        score: finalScore ?? 0,
        completionTimeInSeconds,
        incorrectAnswers: stats?.incorrectAnswers || 0,
        skipsUsed: stats?.skipButtonClicks || 0,
      });

      // Trigger refresh via callback
      onSubmitSuccess?.();
    } catch (error) {
      console.error("Failed to submit highscore:", error);
    }
  };

  useEffect(() => {
    const loadHighscores = async () => {
      try {
        const scores = await highscoreApi.getTopHighscores(limit);
        setHighscores(scores);
      } catch (err) {
        setError("Failed to load highscores");
        console.error("Failed to load highscores:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHighscores();
  }, [limit, refreshTrigger]);

  if (isLoading) {
    return (
      <Title label="Loading highscores..." theme={theme} titleSize="small" />
    );
  }

  if (error) {
    return <Title label={error} theme={theme} titleSize="small" />;
  }

  if (highscores.length === 0) {
    return (
      <div className={styles.highscoreWrapper}>
        <div className={cx(styles.scoreContainer, styles[theme || "dark"])}>
          <Title
            label={ScoreMessages.HIGH_SCORES}
            theme={theme}
            className={styles.highScore}
          />
          <Title label="No highscores yet!" theme={theme} titleSize="small" />
        </div>
        {showSubmitButton &&
          finalScore !== null &&
          finalScore !== undefined &&
          !Number.isNaN(finalScore) && (
            <Button
              size="medium"
              onClick={handleSubmitHighscore}
              isLocked={false}
              primary={true}
              label="🏆 Submit to Leaderboard"
            />
          )}
      </div>
    );
  }

  return (
    <div className={styles.highscoreWrapper}>
      <div className={cx(styles.scoreContainer, styles[theme || "dark"])}>
        <Title
          label={ScoreMessages.HIGH_SCORES}
          theme={theme}
          className={styles.highScore}
        />
        <div className={styles.highscoreList}>
          {highscores.map((score, index) => (
            <div
              key={score.userId}
              className={cx(styles.highscoreEntry, styles[theme || "dark"])}
            >
              <div className={styles.userInfo}>
                <span className={styles.rank}>{index + 1}.</span>
                <span>{score.userId}</span>
                <span className={styles.score}>
                  {score.score.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showSubmitButton &&
        finalScore !== null &&
        finalScore !== undefined &&
        !Number.isNaN(finalScore) && (
          <Button
            size="medium"
            onClick={handleSubmitHighscore}
            isLocked={false}
            primary={true}
            label="🏆 Submit to Leaderboard"
          />
        )}
    </div>
  );
}
