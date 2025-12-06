"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import cx from "classnames";
import { useRouter } from "next/navigation";
import { useIsClient } from "src/shared/hooks/useIsClient";

import { useSettings, useStatistics } from "@app/context/client";
import { useAuth } from "@app/context/client";
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
  const {
    statistics,
    refreshStatistics,
    isLoading: statisticsLoading,
  } = useStatistics();
  const { deleteAccount } = useAuth();
  const [endDate, setEndDate] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [frozenTimeLeft, setFrozenTimeLeft] = useState<number | null>(null);
  const [shouldCompleteGame, setShouldCompleteGame] = useState(false);
  const isRestartingRef = useRef(false);
  const lastCompletedTimeRef = useRef<number | null>(null);
  const hasHandledExpiredTimerRef = useRef(false);

  const handleRestart = useCallback(async () => {
    if (isRestartingRef.current) return;
    isRestartingRef.current = true;

    try {
      // Only delete non-admin accounts
      const isAdmin = settings?.isAdmin === true;

      if (!isAdmin) {
        try {
          await settingsApi.clearTimerEndDate();
          lastCompletedTimeRef.current = Date.now();
        } catch (error) {
          console.error("Error clearing timer:", error);
        }
        await deleteAccount();
        return;
      }

      // Admin: restart game
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "restart" }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to restart game (${response.status})`
        );
      }

      await settingsApi.clearTimerEndDate();
      lastCompletedTimeRef.current = Date.now();
      await quizApi.resetAllProgress();
      await refreshStatistics();
      await refreshSettings();

      setFrozenTimeLeft(null);
      setEndDate(null);
      setGameCompleted(false);

      router.push("/level/start");
    } catch (error) {
      console.error("Error during restart:", error);
    } finally {
      isRestartingRef.current = false;
    }
  }, [
    settings?.isAdmin,
    deleteAccount,
    refreshSettings,
    refreshStatistics,
    router,
    settings,
  ]);

  useEffect(() => {
    if (isLoading || !settings) return;

    // If timer has already expired when we load settings, clear it immediately
    // This prevents the timer from triggering on login if it expired during previous session
    if (
      settings.timerEndDate &&
      settings.timerEndDate - Date.now() <= 0 &&
      !hasHandledExpiredTimerRef.current
    ) {
      hasHandledExpiredTimerRef.current = true;
      lastCompletedTimeRef.current = Date.now();
      settingsApi
        .clearTimerEndDate()
        .then(() => {
          refreshSettings();
        })
        .catch(console.error);
      return;
    }
  }, [isLoading, settings, refreshSettings]);

  useEffect(() => {
    if (
      shouldCompleteGame ||
      !settings?.timerEndDate ||
      isLoading ||
      statisticsLoading
    )
      return;

    // Prevent re-triggering if we just completed game within last 3 seconds
    if (
      lastCompletedTimeRef.current &&
      Date.now() - lastCompletedTimeRef.current < 3000
    ) {
      return;
    }

    const delta = settings.timerEndDate - Date.now();
    if (delta <= 0) {
      lastCompletedTimeRef.current = Date.now();
      setShouldCompleteGame(true);
    }
  }, [
    shouldCompleteGame,
    settings?.timerEndDate,
    isLoading,
    statisticsLoading,
  ]);

  useEffect(() => {
    if (!shouldCompleteGame) return;

    if (isRestartingRef.current) return;

    // Only proceed if BOTH settings AND statistics are fully loaded with admin flag defined
    if (
      isLoading ||
      statisticsLoading ||
      !settings ||
      settings.isAdmin === undefined
    ) {
      return;
    }

    handleRestart();
    setShouldCompleteGame(false);
  }, [
    shouldCompleteGame,
    handleRestart,
    isLoading,
    statisticsLoading,
    settings,
  ]);
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

    if (gameCompleted && !statistics.gameCompletedAt) {
      setGameCompleted(false);
      setFrozenTimeLeft(null);
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
  ]);

  if (!isClient) {
    return <CountdownLoader />;
  }

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
            className={cx(
              styles.normalButton,
              styles[settings?.theme || "dark"]
            )}
            onClick={() => {
              handleRestart();
            }}
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
      ...(settings?.isAdmin
        ? [{ hours: 0.01, label: "Test (30s)", style: "hardButton" }]
        : []),
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
              className={cx(styles[style], styles[settings?.theme || "dark"])}
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
          onComplete={() => setShouldCompleteGame(true)}
        />
      </span>
    </div>
  );
};
