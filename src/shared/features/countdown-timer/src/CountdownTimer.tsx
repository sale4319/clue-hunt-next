"use client";

import { useState, useEffect } from "react";
import Countdown, { CountdownRenderProps } from "react-countdown";
import styles from "./CountdownTimer.module.css";

const twoDigits = (num: number) => String(num).padStart(2, "0");

const renderer = ({ hours, minutes, seconds }: CountdownRenderProps) => (
  <span>
    {twoDigits(hours)}:{twoDigits(minutes)}:{twoDigits(seconds)}
  </span>
);

const getLocalStorageValue = (s: string) => localStorage.getItem(s);

export const CountdownTimer = () => {
  const [data, setData] = useState(
    { date: Date.now(), delay: 86400000 } //Milliseconds
  );
  const wantedDelay = 86400000; //Milliseconds

  useEffect(() => {
    const savedDate = getLocalStorageValue("end_date");
    if (savedDate != null) {
      const currentTime = Date.now();
      const delta = parseInt(savedDate, 10) - currentTime;

      if (delta > wantedDelay) {
        const endDate = localStorage.getItem("end_date");
        if (endDate && endDate.length > 0) localStorage.removeItem("end_date");
      } else {
        setData({ date: currentTime, delay: delta });
      }
    }
  }, []);

  return (
    <span className={styles.timeCounter}>
      <Countdown
        date={data.date + data.delay}
        renderer={renderer}
        onStart={() => {
          if (localStorage.getItem("end_date") == null)
            localStorage.setItem(
              "end_date",
              JSON.stringify(data.date + data.delay)
            );
        }}
        onComplete={() => {
          if (localStorage.getItem("end_date") != null)
            localStorage.removeItem("end_date");
        }}
      />
    </span>
  );
};
