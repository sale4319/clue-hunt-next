import React, { useCallback, useEffect, useState } from "react";

import { QuestionProps } from "../../types";

import styles from "./QuestionComponent.module.css";

export const QuestionComponent = ({
  question,
  setAnswerStatus,
  savedAnswerIndex = null,
  onAnswerSelected,
  theme,
}: QuestionProps) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );

  // Initialize with saved answer when question changes or on mount
  useEffect(() => {
    // Set the selected answer index (could be null/undefined for unanswered)
    const answerIndex = savedAnswerIndex ?? null;
    setSelectedAnswerIndex(answerIndex);

    // Update answer status if we have a saved answer
    if (answerIndex !== null) {
      setAnswerStatus(answerIndex === question.correctAnswerIndex);
    }
  }, [
    question,
    savedAnswerIndex,
    question.correctAnswerIndex,
    setAnswerStatus,
  ]);

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
        setAnswerStatus(index === question.correctAnswerIndex);
        onAnswerSelected(index); // Save answer immediately
      }
    },
    [
      selectedAnswerIndex,
      question.correctAnswerIndex,
      setAnswerStatus,
      onAnswerSelected,
    ]
  );

  return (
    <div className={styles.question}>
      <div className={styles.questionText}>{question.question}</div>
      <div className={styles.answers}>
        {question.answers.map((answer, index) => (
          <div
            key={index}
            className={`${[styles.answer, styles[theme]].join(
              " "
            )} ${getAnswerClasses(index)}`}
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
