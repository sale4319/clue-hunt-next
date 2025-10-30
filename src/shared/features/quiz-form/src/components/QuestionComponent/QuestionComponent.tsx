import React, { useCallback, useEffect, useState } from "react";

import styles from "./QuestionComponent.module.css";

type Question = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

type QuestionProps = {
  question: Question;
  questionIndex: number;
  savedAnswerIndex?: number;
  onAnswer: (selectedIndex: number, isCorrect: boolean) => void;
};

export const QuestionComponent = ({
  question,
  questionIndex,
  savedAnswerIndex,
  onAnswer,
}: QuestionProps) => {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    savedAnswerIndex !== undefined ? savedAnswerIndex : null
  );
  const [hasAnswered, setHasAnswered] = useState(
    savedAnswerIndex !== undefined
  );

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswerIndex(
      savedAnswerIndex !== undefined ? savedAnswerIndex : null
    );
    setHasAnswered(savedAnswerIndex !== undefined);
  }, [questionIndex, savedAnswerIndex]);

  // Only call onAnswer for NEW answers (not loaded from saved state)
  useEffect(() => {
    if (
      selectedAnswerIndex !== null &&
      !hasAnswered &&
      savedAnswerIndex === undefined
    ) {
      onAnswer(
        selectedAnswerIndex,
        selectedAnswerIndex === question.correctAnswerIndex
      );
      setHasAnswered(true);
    }
  }, [
    selectedAnswerIndex,
    question.correctAnswerIndex,
    onAnswer,
    savedAnswerIndex,
    hasAnswered,
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
