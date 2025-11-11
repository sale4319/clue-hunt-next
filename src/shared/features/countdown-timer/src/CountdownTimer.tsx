"use client";

import { useCallback, useEffect, useState } from "react";
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

  const handleComplete = useCallback(async () => {
    await deleteAccount();
  }, [deleteAccount]);

  const handleRestart = async () => {
    try {
      setGameCompleted(false);
      setFrozenTimeLeft(null);
      setEndDate(null);

      await statisticsApi.resetStatistics();

      await quizApi.resetAllProgress();

      await settingsApi.clearTimerEndDate();

      await refreshSettings();
      await refreshStatistics();
    } catch (error) {
      console.error("Error during restart:", error);

      setGameCompleted(false);
      setFrozenTimeLeft(null);
      setEndDate(null);
    }
  };

  useEffect(() => {
    if (!statistics) return;

    if (statistics.gameCompletedAt) {
      setGameCompleted(true);

      setEndDate(null);

      if (statistics.timeLeft && statistics.timeLeft > 0) {
        setFrozenTimeLeft(statistics.timeLeft);
      } else if (
        statistics.completionTimeInSeconds &&
        statistics.completionTimeInSeconds > 0
      ) {
        const estimatedOriginalSeconds = 2 * 3600;
        const remainingSeconds = Math.max(
          0,
          estimatedOriginalSeconds - statistics.completionTimeInSeconds
        );
        const frozenMs = remainingSeconds * 1000;
        setFrozenTimeLeft(frozenMs);
      } else {
        setFrozenTimeLeft(0);
      }

      if (settings?.timerEndDate) {
        settingsApi.clearTimerEndDate().catch((error) => {
          console.error("Failed to clear timer end date:", error);
        });
      }
      return;
    }

    if (gameCompleted) return;

    const completedLevelsCount = statistics.completedLevelsMap
      ? Object.values(statistics.completedLevelsMap).filter(
          (val) => val === true
        ).length
      : 0;

    const completedQuizzesCount = statistics.correctlyCompletedQuizzes || 0;

    const isGameComplete =
      completedLevelsCount === 7 && completedQuizzesCount === 7;

    if (isGameComplete && endDate && !statistics.gameCompletedAt) {
      setGameCompleted(true);

      const currentTime = Date.now();
      const timeLeft = endDate - currentTime;
      setEndDate(null);

      if (timeLeft > 0) {
        setFrozenTimeLeft(timeLeft);

        statisticsApi.setTimeLeft(timeLeft).catch((error) => {
          console.error("Failed to save time left:", error);
        });
      } else if (timeLeft <= 0) {
        setFrozenTimeLeft(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statistics, endDate, gameCompleted]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!settings) {
      setEndDate(null);
      return;
    }

    if (!statistics) {
      setEndDate(null);
      return;
    }

    if (gameCompleted || statistics?.gameCompletedAt) {
      setEndDate(null);

      if (settings?.timerEndDate) {
        settingsApi.clearTimerEndDate().catch((error) => {
          console.error("Failed to clear timer end date:", error);
        });
      }
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

  if (gameCompleted || statistics?.gameCompletedAt) {
    let displayFrozenTime = frozenTimeLeft;
    if (
      displayFrozenTime === null &&
      statistics?.gameCompletedAt &&
      statistics
    ) {
      if (statistics.timeLeft && statistics.timeLeft > 0) {
        displayFrozenTime = statistics.timeLeft;
      } else if (
        statistics.completionTimeInSeconds &&
        statistics.completionTimeInSeconds > 0
      ) {
        const estimatedOriginalSeconds = 2 * 3600;
        const remainingSeconds = Math.max(
          0,
          estimatedOriginalSeconds - statistics.completionTimeInSeconds
        );
        displayFrozenTime = remainingSeconds * 1000;
      } else {
        displayFrozenTime = 0;
      }
    }

    return (
      <div className={styles.container}>
        <span className={styles.timeCounter}>
          <span>{formatTimeFromMs(displayFrozenTime ?? 0)}</span>
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
    return (
      <div className={styles.container}>
        <span className={styles.timeCounter}>
          <span>00:00:00</span>
        </span>
        <div className={styles.difficultyButtons}>
          <button
            className={[
              styles.easyButton,
              styles[settings?.theme || "dark"],
            ].join(" ")}
            onClick={() => setDifficulty(4)}
          >
            Easy (4h)
          </button>
          <button
            className={[
              styles.normalButton,
              styles[settings?.theme || "dark"],
            ].join(" ")}
            onClick={() => setDifficulty(2)}
          >
            Normal (2h)
          </button>
          <button
            className={[
              styles.hardButton,
              styles[settings?.theme || "dark"],
            ].join(" ")}
            onClick={() => setDifficulty(1)}
          >
            Hard (1h)
          </button>
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
