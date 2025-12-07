import cx from "classnames";

import { useSettings } from "@app/context/client";

import styles from "../CountdownTimer.module.css";

export const CountdownLoader = () => {
  const { settings } = useSettings();

  const hasActiveTimer = settings?.timerEndDate != null;

  const difficultyButtons = [
    { hours: 1, label: "Easy (1h)", style: "easyButton" },
    { hours: 0.5, label: "Normal (30m)", style: "normalButton" },
    { hours: 0.25, label: "Hard (15m)", style: "hardButton" },
  ];
  return (
    <div className={styles.container}>
      <span className={styles.timeCounter}>
        <span>Loading</span>
      </span>

      {!hasActiveTimer && (
        <div className={styles.difficultyButtons}>
          {difficultyButtons.map(({ label, style }) => (
            <button
              key={label}
              className={cx(styles[style], styles[settings?.theme || "dark"])}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
