import React from "react";

import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
  currentQuestionIndex: number;
  totalQuestionsCount: number;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestionIndex,
  totalQuestionsCount,
}) => {
  const progressPercentage = (currentQuestionIndex / totalQuestionsCount) * 100;

  return (
    <div className={styles.progressBar}>
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
