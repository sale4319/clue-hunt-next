import React from "react";
import cx from "classnames";

import { ProgressBarProps } from "../../types";

import styles from "./ProgressBar.module.css";

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestionIndex,
  totalQuestionsCount,
  theme,
}) => {
  const progressPercentage = (currentQuestionIndex / totalQuestionsCount) * 100;

  return (
    <div className={cx(styles.progressBar, styles[theme])}>
      <div className={styles.text}>
        {currentQuestionIndex} answered (
        {totalQuestionsCount - currentQuestionIndex} remaining)
      </div>
      <div
        className={styles.inner}
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};
