import { useSettings } from "@app/context/client";

import styles from "../CountdownTimer.module.css";

export const CountdownLoader = () => {
  const { settings } = useSettings();

  const savedDate = settings?.timerEndDate;
  const showDifficultyButtons =
    savedDate && savedDate !== null && savedDate !== undefined;
  return (
    <div className={styles.container}>
      <span className={styles.timeCounter}>
        <span>Loading</span>
      </span>

      {!showDifficultyButtons && (
        <div className={styles.difficultyButtons}>
          <button className={styles.easyButton}>Easy (4h)</button>
          <button className={styles.normalButton}>Normal (2h)</button>
          <button className={styles.hardButton}>Hard (1h)</button>
        </div>
      )}
    </div>
  );
};
