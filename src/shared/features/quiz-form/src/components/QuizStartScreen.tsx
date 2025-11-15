import React from "react";
import { Button } from "clue-hunt-ui";

import { QuizFormMessages } from "@app/messages-contract";

import { QuizStartScreenProps } from "../types";

import styles from "../QuizForm.module.css";

export const QuizStartScreen: React.FC<QuizStartScreenProps> = ({
  theme,
  onStart,
}) => {
  return (
    <div className={[styles.quiz, styles[theme]].join(" ")}>
      <h1>{QuizFormMessages.TITLE}</h1>
      <p>{QuizFormMessages.DESCRIPTION}</p>
      <p>
        <Button
          mode={theme === "dark" ? "up" : "fill"}
          onClick={onStart}
          label={QuizFormMessages.START_BUTTON}
          size="medium"
        />
      </p>
    </div>
  );
};
