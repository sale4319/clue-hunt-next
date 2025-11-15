import { useSettings } from "@app/context/client";

import styles from "../CountdownTimer.module.css";

export const CountdownLoader = () => {
  const { settings } = useSettings();

  const hasActiveTimer = settings?.timerEndDate != null;

  const difficultyButtons = [
    { label: "Easy (1h)", style: "easyButton" },
    { label: "Normal (30m)", style: "normalButton" },
    { label: "Hard (15m)", style: "hardButton" },
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
              className={[
                styles[style],
                styles[settings?.theme || "dark"],
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
