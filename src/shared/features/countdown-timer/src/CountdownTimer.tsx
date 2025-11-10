"use client";

import { useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import { useIsClient } from "src/shared/hooks/useIsClient";

import { useAuth, useSettings, useStatistics } from "@app/context/client";
import { quizApi, settingsApi, statisticsApi } from "@app/lib/client";

import { CountdownLoader } from "./CountdownLoader/CountdownLodaer";

import styles from "./CountdownTimer.module.css";

const twoDigits = (num: number) => String(num).padStart(2, "0");

const formatTimeFromMs = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${twoDigits(hours)}:${twoDigits(minutes)}:${twoDigits(seconds)}`;
};

const renderer = ({ hours, minutes, seconds }: CountdownRenderProps) => (
  <span>
    {twoDigits(hours)}:{twoDigits(minutes)}:{twoDigits(seconds)}
  </span>
);

export const CountdownTimer = () => {
  const isClient = useIsClient();
  const { settings, isLoading, refreshSettings } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();
  const { deleteAccount } = useAuth();
  const [endDate, setEndDate] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [frozenTimeLeft, setFrozenTimeLeft] = useState<number | null>(null);

  const handleComplete = async () => {
    await deleteAccount();
  };

  const handleRestart = async () => {
    // Reset statistics first (this clears completedLevelsMap and completedQuizzesMap)
    await statisticsApi.resetStatistics();

    // Reset all quiz progress (this clears all quiz sessions)
    await quizApi.resetAllProgress();

    // Refresh statistics context to update the UI
    await refreshStatistics();

    // Reset game completion state and allow new difficulty selection
    setGameCompleted(false);
    setFrozenTimeLeft(null);
    setEndDate(null);
    await settingsApi.clearTimerEndDate();
    await refreshSettings();
  };

  // Check if game is complete (7/7 levels and 7/7 quizzes)
  useEffect(() => {
    if (!statistics || gameCompleted) return;

    const completedLevelsCount = statistics.completedLevelsMap
      ? Object.values(statistics.completedLevelsMap).filter(
          (val) => val === true
        ).length
      : 0;

    const completedQuizzesCount = statistics.correctlyCompletedQuizzes || 0;

    const isGameComplete =
      completedLevelsCount === 7 && completedQuizzesCount === 7;

    if (isGameComplete && endDate) {
      setGameCompleted(true);

      // Calculate remaining time
      const currentTime = Date.now();
      const timeLeft = endDate - currentTime;

      if (timeLeft > 0) {
        // Freeze the timer at this time
        setFrozenTimeLeft(timeLeft);

        // Save the time left
        statisticsApi.setTimeLeft(timeLeft).catch((error) => {
          console.error("Failed to save time left:", error);
        });
      }
    }
  }, [statistics, gameCompleted, endDate]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!settings) {
      setEndDate(null);
      return;
    }

    const savedDate = settings.timerEndDate;

    if (
      endDate === savedDate &&
      savedDate !== null &&
      savedDate !== undefined
    ) {
      return;
    }

    if (savedDate != null && savedDate !== undefined) {
      const currentTime = Date.now();
      const delta = savedDate - currentTime;

      if (delta <= 0) {
        handleComplete();
      } else {
        setEndDate(savedDate);
      }
    } else {
      setEndDate(null);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.timerEndDate, isLoading]);

  if (!isClient) {
    return <CountdownLoader />;
  }

  const setDifficulty = async (hours: number) => {
    const newEndDate = Date.now() + hours * 60 * 60 * 1000;
    setEndDate(newEndDate);
    await settingsApi.setTimerEndDate(newEndDate);
    await refreshSettings();
  };

  // Game completed - show frozen time and restart button
  if (gameCompleted && frozenTimeLeft !== null) {
    return (
      <div className={styles.container}>
        <span className={styles.timeCounter}>
          <span>{formatTimeFromMs(frozenTimeLeft)}</span>
        </span>
        <div className={styles.difficultyButtons}>
          <button className={styles.normalButton} onClick={handleRestart}>
            Restart
          </button>
        </div>
      </div>
    );
  }

  // No timer started yet - show initial difficulty selection
  if (!endDate) {
    return (
      <div className={styles.container}>
        <span className={styles.timeCounter}>
          <span>00:00:00</span>
        </span>
        <div className={styles.difficultyButtons}>
          <button
            className={styles.easyButton}
            onClick={() => setDifficulty(4)}
          >
            Easy (4h)
          </button>
          <button
            className={styles.normalButton}
            onClick={() => setDifficulty(2)}
          >
            Normal (2h)
          </button>
          <button
            className={styles.hardButton}
            onClick={() => setDifficulty(1)}
          >
            Hard (1h)
          </button>
        </div>
      </div>
    );
  }

  // Timer is running
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
