import React from "react";
import { Button } from "clue-hunt-ui";

import { QuizFormMessages } from "@app/messages-contract";

import { QuizInProgressScreenProps } from "../types";
import { ProgressBar, QuestionComponent } from "./";

import styles from "../QuizForm.module.css";

export const QuizInProgressScreen: React.FC<QuizInProgressScreenProps> = ({
  theme,
  questionIndex,
  totalQuestions,
  question,
  answerStatus,
  savedAnswerIndex,
  isLastQuestion,
  onAnswerSelected,
  onNext,
  setAnswerStatus,
}) => {
  return (
    <div className={[styles.quiz, styles[theme]].join(" ")}>
      <ProgressBar
        currentQuestionIndex={questionIndex}
        totalQuestionsCount={totalQuestions}
      />
      <QuestionComponent
        question={question}
        setAnswerStatus={setAnswerStatus}
        savedAnswerIndex={savedAnswerIndex}
        onAnswerSelected={onAnswerSelected}
      />
      {answerStatus !== null && !isLastQuestion && (
        <div>
          <Button
            mode="slide"
            onClick={onNext}
            size="medium"
            label={QuizFormMessages.NEXT_BUTTON}
          />
        </div>
      )}
    </div>
  );
};
