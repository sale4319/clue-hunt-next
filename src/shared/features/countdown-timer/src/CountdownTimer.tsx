"use client";

import { useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";

import { useSettings } from "@app/context/client";
import { useAuth } from "@app/context/client";
import { settingsApi } from "@app/lib/client";

import styles from "./CountdownTimer.module.css";

const twoDigits = (num: number) => String(num).padStart(2, "0");

const renderer = ({ hours, minutes, seconds }: CountdownRenderProps) => (
  <span>
    {twoDigits(hours)}:{twoDigits(minutes)}:{twoDigits(seconds)}
  </span>
);

export const CountdownTimer = () => {
  const { settings, isLoading, refreshSettings } = useSettings();
  const { deleteAccount } = useAuth();
  const [endDate, setEndDate] = useState<number | null>(null);

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
        setEndDate(null);
      } else {
        setEndDate(savedDate);
      }
    } else {
      setEndDate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.timerEndDate, isLoading]);

  const handleComplete = async () => {
    await deleteAccount();
  };

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
