import React from "react";
import { Button } from "clue-hunt-ui";

import { QuizFormMessages } from "@app/messages-contract";

import { QuizCompleteScreenProps } from "../types";

import styles from "../QuizForm.module.css";

export const QuizCompleteScreen: React.FC<QuizCompleteScreenProps> = ({
  theme,
  correctAnswerCount,
  totalQuestions,
  isPerfectScore,
  onUnlock,
  onRestart,
}) => {
  return (
    <div className={[styles.quiz, styles[theme]].join(" ")}>
      <h1>{QuizFormMessages.TITLE_COMPLETE}</h1>
      <p>
        {QuizFormMessages.CORRECT_ANSWERS} {correctAnswerCount}{" "}
        {QuizFormMessages.TOTAL_QUESTIONS} {totalQuestions}
      </p>
      {isPerfectScore ? (
        <p>
          <Button
            mode="slide"
            onClick={onUnlock}
            label={QuizFormMessages.UNLOCK_BUTTON}
            size="medium"
          />
        </p>
      ) : (
        <p>
          <Button
            mode="raise"
            onClick={onRestart}
            label={QuizFormMessages.RESTART_BUTTON}
            size="medium"
          />
        </p>
      )}
    </div>
  );
};
