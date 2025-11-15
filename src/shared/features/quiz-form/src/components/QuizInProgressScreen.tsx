import React, { useEffect, useRef, useState } from "react";
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
  const [countdownSeconds, setCountdownSeconds] = useState<number>(2000);
  const countdownStartedRef = useRef(false);

  useEffect(() => {
    if (
      isLastQuestion &&
      answerStatus !== null &&
      !countdownStartedRef.current
    ) {
      countdownStartedRef.current = true;
      const startTime = Date.now();
      const duration = 2000;

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        setCountdownSeconds(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          onNext();
        }
      }, 10);

      return () => clearInterval(interval);
    }

    if (
      (!isLastQuestion || answerStatus === null) &&
      countdownStartedRef.current
    ) {
      countdownStartedRef.current = false;
      setCountdownSeconds(2000);
    }
  }, [isLastQuestion, answerStatus, onNext]);

  return (
    <div className={[styles.quiz, styles[theme]].join(" ")}>
      <ProgressBar
        currentQuestionIndex={questionIndex}
        totalQuestionsCount={totalQuestions}
        theme={theme}
      />
      <QuestionComponent
        question={question}
        setAnswerStatus={setAnswerStatus}
        savedAnswerIndex={savedAnswerIndex}
        onAnswerSelected={onAnswerSelected}
        theme={theme}
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
      {answerStatus !== null && isLastQuestion && (
        <div>
          <Button
            mode="slide"
            onClick={onNext}
            size="medium"
            label={"Results " + Math.ceil(countdownSeconds / 100)}
          />
        </div>
      )}
    </div>
  );
};
