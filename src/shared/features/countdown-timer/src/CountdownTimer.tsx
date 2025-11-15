"use client";

import { useCallback, useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { useRouter } from "next/navigation";
import { useIsClient } from "src/shared/hooks/useIsClient";

import { useAuth, useSettings, useStatistics } from "@app/context/client";
import { quizApi, settingsApi, statisticsApi } from "@app/lib/client";
import { formatTimeFromMs, twoDigits } from "@app/utils";

import { CountdownLoader } from "./CountdownLoader/CountdownLodaer";

import styles from "./CountdownTimer.module.css";

const renderer = ({ hours, minutes, seconds }: CountdownRenderProps) => (
  <span>
    {twoDigits(hours)}:{twoDigits(minutes)}:{twoDigits(seconds)}
  </span>
);

export const CountdownTimer = () => {
  const isClient = useIsClient();
  const router = useRouter();
  const { settings, isLoading, refreshSettings } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();
  const { deleteAccount } = useAuth();
  const [endDate, setEndDate] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [frozenTimeLeft, setFrozenTimeLeft] = useState<number | null>(null);

  const handleRestart = useCallback(async () => {
    try {
      setGameCompleted(false);
      setFrozenTimeLeft(null);
      setEndDate(null);

      await statisticsApi.resetStatistics();
      await quizApi.resetAllProgress();
      await settingsApi.clearTimerEndDate();

      await refreshSettings();
      await refreshStatistics();

      setGameCompleted(false);
      router.push("/level/start");
    } catch (error) {
      console.error("Error during restart:", error);

      // Even on error, clear local state to allow retry
      setGameCompleted(false);
      setFrozenTimeLeft(null);
      setEndDate(null);
    }
  }, [refreshSettings, refreshStatistics, router]);

  const handleComplete = useCallback(async () => {
    if (settings?.isAdmin) {
      await handleRestart();
      return;
    }
    await deleteAccount();
  }, [deleteAccount, settings?.isAdmin, handleRestart]);

  useEffect(() => {
    if (!statistics) return;

    if (statistics.gameCompletedAt) {
      setGameCompleted(true);
      setEndDate(null);

      // Calculate frozen time from saved data
      const timeLeft =
        statistics.timeLeft && statistics.timeLeft > 0
          ? statistics.timeLeft
          : statistics.completionTimeInSeconds &&
            statistics.completionTimeInSeconds > 0
          ? Math.max(0, 2 * 3600 - statistics.completionTimeInSeconds) * 1000
          : 0;

      setFrozenTimeLeft(timeLeft);

      if (settings?.timerEndDate) {
        settingsApi.clearTimerEndDate().catch(console.error);
      }
      return;
    }

    if (gameCompleted) return;

    const completedLevelsCount = Object.values(
      statistics.completedLevelsMap || {}
    ).filter(Boolean).length;
    const completedQuizzesCount = statistics.correctlyCompletedQuizzes || 0;
    const isGameComplete =
      completedLevelsCount === 7 && completedQuizzesCount === 7;

    if (isGameComplete && endDate && !statistics.gameCompletedAt) {
      setGameCompleted(true);
      const timeLeft = Math.max(0, endDate - Date.now());
      setEndDate(null);
      setFrozenTimeLeft(timeLeft);

      if (timeLeft > 0) {
        statisticsApi.setTimeLeft(timeLeft).catch(console.error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statistics, endDate, gameCompleted]);

  useEffect(() => {
    if (isLoading || !settings || !statistics) {
      setEndDate(null);
      return;
    }

    if (gameCompleted || statistics?.gameCompletedAt) {
      setEndDate(null);
      if (settings?.timerEndDate) {
        settingsApi.clearTimerEndDate().catch(console.error);
      }
      return;
    }

    const savedDate = settings.timerEndDate;
    if (endDate === savedDate && savedDate != null) return;

    if (savedDate != null) {
      const delta = savedDate - Date.now();
      if (delta > 0) {
        setEndDate(savedDate);
      } else {
        setEndDate(null);
      }
    } else {
      setEndDate(null);
    }
  }, [
    settings,
    isLoading,
    gameCompleted,
    statistics?.gameCompletedAt,
    statistics,
    endDate,
    handleComplete,
  ]);

  if (!isClient) {
    return <CountdownLoader />;
  }

  // Show completed state only if gameCompleted is true AND we have completion data
  if (
    gameCompleted &&
    (frozenTimeLeft !== null || statistics?.gameCompletedAt)
  ) {
    const displayFrozenTime =
      frozenTimeLeft ??
      (statistics?.timeLeft && statistics.timeLeft > 0
        ? statistics.timeLeft
        : statistics?.completionTimeInSeconds &&
          statistics.completionTimeInSeconds > 0
        ? Math.max(0, 2 * 3600 - statistics.completionTimeInSeconds) * 1000
        : 0);

    return (
      <div className={styles.container}>
        <span className={styles.timeCounter}>
          <span>{formatTimeFromMs(displayFrozenTime)}</span>
        </span>
        <div className={styles.difficultyButtons}>
          <button
            className={[
              styles.normalButton,
              styles[settings?.theme || "dark"],
            ].join(" ")}
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      </div>
    );
  }

  const setDifficulty = async (hours: number) => {
    const newEndDate = Date.now() + hours * 60 * 60 * 1000;
    setEndDate(newEndDate);
    await settingsApi.setTimerEndDate(newEndDate);
    await refreshSettings();
  };

  if (!endDate) {
    const difficultyButtons = [
      { hours: 1, label: "Easy (1h)", style: "easyButton" },
      { hours: 0.5, label: "Normal (30m)", style: "normalButton" },
      { hours: 0.25, label: "Hard (15m)", style: "hardButton" },
    ];

    return (
      <div className={styles.container}>
        <span className={styles.timeCounter}>
          <span>00:00:00</span>
        </span>
        <div className={styles.difficultyButtons}>
          {difficultyButtons.map(({ hours, label, style }) => (
            <button
              key={label}
              className={[
                styles[style],
                styles[settings?.theme || "dark"],
              ].join(" ")}
              onClick={() => setDifficulty(hours)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <span className={styles.timeCounter}>
        <Countdown
          key={endDate}
          date={endDate}
          renderer={renderer}
          onComplete={handleComplete}
        />
      </span>
    </div>
  );
};
