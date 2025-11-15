"use client";

import React, { useEffect, useState } from "react";
import { Button, SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings } from "@app/context/client";
import {
  settingsApi,
  statisticsApi,
  type UserStatistics,
} from "@app/lib/client";
import { ScoreBoard } from "@app/score-board";
import {
  calculateScore,
  getRoute,
  getRouteWithSkip,
  getTimeLeftDisplay,
} from "@app/utils";

export default function LevelEnd() {
  const router = useRouter();
  const { settings, isTimerStarted, refreshSettings } = useSettings();

  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [highscoreRefreshTrigger, setHighscoreRefreshTrigger] = useState(0);

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
    if (!stats || isLoading) return;

    const correctQuizzes = stats.correctlyCompletedQuizzes || 0;
    const completedLevels = stats.completedLevelsMap
      ? Object.values(stats.completedLevelsMap).filter((val) => val === true)
          .length
      : 0;

    const allCompleted = correctQuizzes >= 7 && completedLevels >= 7;

    if (allCompleted && !stats.gameCompletedAt) {
      const markCompleted = async () => {
        try {
          if (settings?.timerEndDate) {
            const currentTime = Date.now();
            const timeLeft = settings.timerEndDate - currentTime;
            if (timeLeft > 0) {
              await statisticsApi.setTimeLeft(timeLeft);
            }
          }

          await statisticsApi.markGameCompleted(
            settings?.timerEndDate || undefined
          );

          await settingsApi.clearTimerEndDate();

          await refreshSettings();
          const updatedStats = await statisticsApi.getStatistics();
          setStats(updatedStats);
        } catch (error) {
          console.error("Failed to mark game as completed:", error);
        }
      };

      markCompleted();
    }
  }, [stats, isLoading, settings?.timerEndDate, refreshSettings]);

  const handleSkip = async () => {
    router.push(getRouteWithSkip("level", "start"));
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

  const timeLeftCheck = stats?.timeLeft && stats.timeLeft > 0;

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
    timerEndDate: settings?.timerEndDate,
    timeLeftCheck: Boolean(timeLeftCheck),
    isTimerStarted,
    initialTimerDuration,
  });

  const timeLeftDisplay = getTimeLeftDisplay({
    stats,
    timerEndDate: settings?.timerEndDate,
  });

  return (
    <>
      <ScoreBoard
        theme={settings?.theme}
        showSubmitButton={allCompleted}
        finalScore={finalScore}
        stats={stats}
        timerEndDate={settings?.timerEndDate ?? undefined}
        timeLeftCheck={Boolean(timeLeftCheck)}
        timeLeftDisplay={timeLeftDisplay}
        completedLevelsCount={completedLevelsCount}
        refreshTrigger={highscoreRefreshTrigger}
        onSubmitSuccess={() => setHighscoreRefreshTrigger((prev) => prev + 1)}
      />

      <Button
        size="medium"
        href={getRoute("level", "start")}
        isLocked={false}
        primary={false}
        label="Recycle"
      />
    </>
  );
}
