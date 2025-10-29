"use client";

import { useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";

import { useSettings } from "@app/context/client";
import { settingsApi } from "@app/lib/client";

import styles from "./CountdownTimer.module.css";

const twoDigits = (num: number) => String(num).padStart(2, "0");

const renderer = ({ hours, minutes, seconds }: CountdownRenderProps) => (
  <span>
    {twoDigits(hours)}:{twoDigits(minutes)}:{twoDigits(seconds)}
  </span>
);

export const CountdownTimer = () => {
  const { settings, refreshSettings, isLoading } = useSettings();
  const wantedDelay = 86400000; // 24 hours in milliseconds
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

      if (delta > wantedDelay) {
        const newEndDate = currentTime + wantedDelay;
        setEndDate(newEndDate);
        settingsApi.setTimerEndDate(newEndDate);
      } else if (delta <= 0) {
        const newEndDate = currentTime + wantedDelay;
        setEndDate(newEndDate);
        settingsApi.setTimerEndDate(newEndDate);
      } else {
        setEndDate(savedDate);
      }
    } else {
      const newEndDate = Date.now() + wantedDelay;
      setEndDate(newEndDate);
      settingsApi.setTimerEndDate(newEndDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.timerEndDate, isLoading]);

  const handleComplete = async () => {
    const newEndDate = Date.now() + wantedDelay;
    setEndDate(newEndDate);
    await settingsApi.setTimerEndDate(newEndDate);
    await refreshSettings();
  };

  if (!endDate) {
    return (
      <span className={styles.timeCounter}>
        <span>00:00:00</span>
      </span>
    );
  }

  return (
    <span className={styles.timeCounter}>
      <Countdown
        key={endDate}
        date={endDate}
        renderer={renderer}
        onComplete={handleComplete}
      />
    </span>
  );
};
