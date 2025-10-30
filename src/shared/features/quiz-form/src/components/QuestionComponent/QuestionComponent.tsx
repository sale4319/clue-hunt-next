import React, { useCallback, useEffect, useState } from "react";

import styles from "./QuestionComponent.module.css";

type Question = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

type QuestionProps = {
  question: Question;
  setAnswerStatus: (isCorrect: boolean) => void;
};

export const QuestionComponent = ({
  question,
  setAnswerStatus,
}: QuestionProps) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (selectedAnswerIndex !== null) {
      setAnswerStatus(selectedAnswerIndex === question.correctAnswerIndex);
    }
  }, [selectedAnswerIndex, question.correctAnswerIndex, setAnswerStatus]);

  useEffect(() => {
    setSelectedAnswerIndex(null);
  }, [question]);

  const getAnswerClasses = useCallback(
    (index: number): string => {
      if (selectedAnswerIndex === null) {
        return "";
      }

      const classes: string[] = [];

      if (selectedAnswerIndex === index) {
        classes.push(styles.selected);
      }

      if (index === question.correctAnswerIndex) {
        classes.push(
          selectedAnswerIndex === index ? styles.correct : styles.incorrect
        );
      }

      return classes.join(" ");
    },
    [selectedAnswerIndex, question.correctAnswerIndex]
  );

  const handleAnswerClick = useCallback(
    (index: number) => {
      // Prevent clicking if already answered
      if (selectedAnswerIndex === null) {
        setSelectedAnswerIndex(index);
      }
    },
    [selectedAnswerIndex]
  );

  return (
    <div className={styles.question}>
      <div className={styles.questionText}>{question.question}</div>
      <div className={styles.answers}>
        {question.answers.map((answer, index) => (
          <div
            key={index}
            className={`${styles.answer} ${getAnswerClasses(index)}`}
            onClick={() => handleAnswerClick(index)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAnswerClick(index);
              }
            }}
          >
            <span className={styles.answerText}>{answer}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
