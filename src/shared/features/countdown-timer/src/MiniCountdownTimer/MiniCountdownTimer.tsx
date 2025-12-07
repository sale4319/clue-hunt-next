"use client";

import { useEffect, useState } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import cx from "classnames";
import { useIsClient } from "src/shared/hooks/useIsClient";

import { useSettings } from "@app/context/client";
import { twoDigits } from "@app/utils";

import styles from "./MiniCountdownTimer.module.css";

type Props = {
  className?: string;
  theme?: string;
};

const renderer = ({ hours, minutes, seconds }: CountdownRenderProps) => (
  <span>
    {twoDigits(hours)}:{twoDigits(minutes)}:{twoDigits(seconds)}
  </span>
);

export const MiniCountdownTimer = ({ className, theme }: Props) => {
  const isClient = useIsClient();
  const { settings, isLoading } = useSettings();
  const [endDate, setEndDate] = useState<number | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (isLoading || !settings) {
      return;
    }

    if (gameCompleted) {
      setEndDate(null);
      return;
    }

    const savedDate = settings.timerEndDate;
    if (endDate === savedDate && savedDate != null) return;

    if (savedDate != null) {
      const delta = savedDate - Date.now();
      if (delta <= 0) {
        setGameCompleted(true);
      } else {
        setEndDate(savedDate);
      }
    } else {
      setEndDate(null);
    }
  }, [settings, isLoading, gameCompleted, endDate]);

  if (!isClient || isLoading) {
    return null;
  }

  if (!endDate) {
    return null;
  }

  return (
    <div className={className}>
      <span className={cx(styles.miniTimeCounter, styles[theme || "dark"])}>
        <Countdown
          key={endDate}
          date={endDate}
          renderer={renderer}
          onComplete={() => setGameCompleted(true)}
        />
      </span>
    </div>
  );
};
