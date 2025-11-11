"use client";

import React, { useEffect, useState } from "react";
import { Button, SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings } from "@app/context/client";
import {
  highscoreApi,
  settingsApi,
  statisticsApi,
  type UserStatistics,
} from "@app/lib/client";
import { ScoreMessages } from "@app/messages-contract";
import { calculateScore, getRoute, getTimeLeftDisplay } from "@app/utils";

import { HighscoreList } from "../../../shared/components/highscore-list/HighscoreList";

import styles from "./styles.module.css";

export default function LevelEnd() {
  const router = useRouter();
  const { settings, isTimerStarted, refreshSettings } = useSettings();

  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScoreExpanded, setIsScoreExpanded] = useState(false);
  const [highscoreSubmitted, setHighscoreSubmitted] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  );
  const timeLeftCheck = stats?.timeLeft && stats.timeLeft > 0;

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statistics = await statisticsApi.getStatistics();
        setStats(statistics);
      } catch (error) {
        console.error("Failed to load statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    console.log("LevelEnd effect running:", { hasStats: !!stats, isLoading });

    if (!stats || isLoading) return;

    const correctQuizzes = stats.correctlyCompletedQuizzes || 0;
    const completedLevelsCount = stats.completedLevelsMap
      ? Object.values(stats.completedLevelsMap).filter((val) => val === true)
          .length
      : 0;

    const allCompleted = correctQuizzes >= 7 && completedLevelsCount >= 7;

    console.log("LevelEnd completion check:", {
      correctQuizzes,
      completedLevelsCount,
      allCompleted,
      gameCompletedAt: stats.gameCompletedAt,
      shouldMarkCompleted: allCompleted && !stats.gameCompletedAt,
    });

    if (allCompleted && !stats.gameCompletedAt) {
      console.log("Game completed but not marked in database, marking now...");
      const markCompleted = async () => {
        try {
          if (settings?.timerEndDate) {
            const currentTime = Date.now();
            const timeLeft = settings.timerEndDate - currentTime;
            if (timeLeft > 0) {
              console.log(
                "Saving time left before marking completed:",
                timeLeft
              );
              await statisticsApi.setTimeLeft(timeLeft);
            }
          }

          await statisticsApi.markGameCompleted(
            settings?.timerEndDate || undefined
          );

          await settingsApi.clearTimerEndDate();

          await refreshSettings();
          const updatedStats = await statisticsApi.getStatistics();
          console.log("Updated stats after marking completed:", updatedStats);
          setStats(updatedStats);
        } catch (error) {
          console.error("Failed to mark game as completed:", error);
        }
      };

      markCompleted();
    }
  }, [stats, isLoading, settings?.timerEndDate, refreshSettings]);

  const handleSkip = async () => {
    router.push(getRoute("level", "start"));
  };

  const handleSubmitHighscore = async () => {
    try {
      setSubmissionMessage(null);

      let completionTimeInSeconds = 0;

      if (stats?.completionTimeInSeconds) {
        completionTimeInSeconds = stats.completionTimeInSeconds;
      } else if (timeLeftCheck && stats?.timeLeft) {
        const timeUsedMs = Math.max(0, 4 * 60 * 60 * 1000 - stats.timeLeft);
        completionTimeInSeconds = Math.floor(timeUsedMs / 1000);
      } else if (settings?.timerEndDate) {
        const currentTime = Date.now();
        const timeRemainingMs = Math.max(
          0,
          settings.timerEndDate - currentTime
        );
        const timeUsedMs = 2 * 60 * 60 * 1000 - timeRemainingMs;
        completionTimeInSeconds = Math.max(0, Math.floor(timeUsedMs / 1000));
      } else {
        completionTimeInSeconds = 3600;
      }

      console.log("Submitting highscore:", {
        score: finalScore,
        completionTimeInSeconds,
        incorrectAnswers: stats?.incorrectAnswers || 0,
        skipsUsed: stats?.skipButtonClicks || 0,
      });

      await highscoreApi.submitHighscore({
        score: finalScore,
        completionTimeInSeconds,
        incorrectAnswers: stats?.incorrectAnswers || 0,
        skipsUsed: stats?.skipButtonClicks || 0,
      });

      setHighscoreSubmitted(true);
      setSubmissionMessage("✅ Score submitted to leaderboard!");
      console.log("Highscore submitted successfully");

      setTimeout(() => {
        setSubmissionMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Failed to submit highscore:", error);
      setSubmissionMessage("❌ Failed to submit score. Please try again.");

      setTimeout(() => {
        setSubmissionMessage(null);
      }, 5000);
    }
  };

  if (isLoading) {
    return (
      <>
        <Title label="Loading statistics..." theme={settings?.theme} />
      </>
    );
  }

  const completedLevelsCount = stats?.completedLevelsMap
    ? Object.values(stats.completedLevelsMap).filter((val) => val === true)
        .length
    : 0;

  const allCompleted =
    (stats?.correctlyCompletedQuizzes || 0) >= 7 && completedLevelsCount >= 7;

  let initialTimerDuration: number | undefined;
  if (settings?.timerEndDate && stats?.gameCompletedAt) {
    const gameCompletedTime = new Date(stats.gameCompletedAt).getTime();
    const remainingTimeMs = Math.max(
      0,
      settings.timerEndDate - gameCompletedTime
    );
    const completionTimeMs = stats.completionTimeInSeconds
      ? stats.completionTimeInSeconds * 1000
      : 0;
    const totalTimerDurationMs = remainingTimeMs + completionTimeMs;
    initialTimerDuration = totalTimerDurationMs / 1000;
  }

  const finalScore = calculateScore({
    stats,
    timerEndDate: allCompleted ? null : settings?.timerEndDate, // Don't use dynamic timer for completed games
    timeLeftCheck: Boolean(timeLeftCheck),
    isTimerStarted,
    initialTimerDuration,
  });

  console.log("LevelEnd score calculation:", {
    allCompleted,
    gameCompletedAt: stats?.gameCompletedAt,
    completionTimeInSeconds: stats?.completionTimeInSeconds,
    timeLeft: stats?.timeLeft,
    timerEndDate: settings?.timerEndDate,
    finalScore,
  });

  const timeLeftDisplay = getTimeLeftDisplay({
    stats,
    timerEndDate: settings?.timerEndDate,
  });

  return (
    <>
      <div className={styles.scoreBoardsWrapper}>
        <div
          className={[
            styles.scoreContainer,
            styles[settings?.theme || "dark"],
          ].join(" ")}
        >
          <Title
            label={ScoreMessages.HIGH_SCORES}
            theme={settings?.theme}
            className={styles.highScore}
          />

          <HighscoreList
            theme={settings?.theme as "light" | "dark"}
            limit={5}
            showTitle={false}
          />
        </div>
        <div
          className={[
            styles.scoreContainer,
            styles[settings?.theme || "dark"],
          ].join(" ")}
        >
          <div onClick={() => setIsScoreExpanded(!isScoreExpanded)}>
            <Title
              label={`${ScoreMessages.TITLE} ${finalScore.toLocaleString()} ${
                isScoreExpanded ? "▼" : "▶"
              }`}
              theme={settings?.theme}
              className={styles.yourScore}
            />
            {!isScoreExpanded && <div className={styles.scoreColapsed} />}
          </div>

          {isScoreExpanded && (
            <div className={styles.scoreExpanded}>
              <Title
                label="Score Calculation:"
                titleSize="xs"
                theme={settings?.theme}
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
            theme={settings?.theme}
          />
          <Title
            label={`${ScoreMessages.INCORRECT_ANSWERS}${
              stats?.incorrectAnswers || 0
            }`}
            titleSize="small"
            theme={settings?.theme}
          />
          <Title
            label={`${ScoreMessages.LEVELS_COMPLETED}${completedLevelsCount}/7`}
            titleSize="small"
            theme={settings?.theme}
          />
          <Title
            label={`${ScoreMessages.SKIPS_USED}${stats?.skipButtonClicks || 0}`}
            titleSize="small"
            theme={settings?.theme}
          />
          <Title
            label={`${
              timeLeftCheck
                ? ScoreMessages.COMPLETION_TIME
                : ScoreMessages.TIME_LEFT
            }${timeLeftDisplay}`}
            titleSize="small"
            theme={settings?.theme}
          />
        </div>
      </div>

      {/* Submit Highscore Button (always show if game is complete) */}
      {allCompleted && finalScore !== null && finalScore !== undefined && (
        <Button
          size="medium"
          onClick={handleSubmitHighscore}
          isLocked={false}
          primary={true}
          label="🏆 Submit to Leaderboard"
        />
      )}

      {submissionMessage && (
        <Title
          label={submissionMessage}
          titleSize="small"
          theme={settings?.theme}
        />
      )}

      <Button
        size="medium"
        href={getRoute("level", "start")}
        isLocked={false}
        primary={false}
        label="Recycle"
      />
      {settings?.skipMode && (
        <SkipButton onClick={handleSkip} disabled={!isTimerStarted} />
      )}
    </>
  );
}
