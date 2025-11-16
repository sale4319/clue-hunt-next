"use client";

import React from "react";
import cx from "classnames";

import {
  QuizCompleteScreen,
  QuizInProgressScreen,
  QuizStartScreen,
} from "./components/";
import { useQuizProgress } from "./hooks/useQuizProgress";
import { useStatisticsTracking } from "./hooks/useStatisticsTracking";
import { QuizProps } from "./types";

import styles from "./QuizForm.module.css";

const QuizForm: React.FC<QuizProps> = ({
  sessionId,
  quizName,
  theme = "dark",
  questions = [],
  handleUnlock,
}) => {
  const {
    questionIndex,
    answerStatus,
    correctAnswerCount,
    quizComplete,
    isLoading,
    answers,
    totalQuestions,
    isLastQuestion,
    wasLoadedAsComplete,
    handleAnswerSelected: onAnswerSelected,
    handleNext,
    handleRestart: onRestart,
    handleStart,
  } = useQuizProgress(sessionId, questions);

  const { isPerfectScore, trackImmediateStatistics, resetTracking } =
    useStatisticsTracking(
      quizName,
      quizComplete,
      correctAnswerCount,
      totalQuestions,
      isLoading,
      wasLoadedAsComplete
    );

  // Wrap answer handler to track statistics immediately
  const handleAnswerSelected = async (answerIndex: number) => {
    const result = await onAnswerSelected(answerIndex);
    if (result?.isLastQuestionAnswered) {
      await trackImmediateStatistics(
        result.newCorrectAnswerCount,
        totalQuestions
      );
    }
  };

  const handleRestart = async () => {
    resetTracking();
    await onRestart();
  };

  if (isLoading) {
    return (
      <div className={cx(styles.quiz, styles[theme])}>
        <p>Loading quiz...</p>
      </div>
    );
  }

  if (questionIndex === null) {
    return <QuizStartScreen theme={theme} onStart={handleStart} />;
  }

  if (quizComplete) {
    return (
      <QuizCompleteScreen
        theme={theme}
        correctAnswerCount={correctAnswerCount}
        totalQuestions={totalQuestions}
        isPerfectScore={isPerfectScore}
        onUnlock={handleUnlock}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <QuizInProgressScreen
      theme={theme}
      questionIndex={questionIndex}
      totalQuestions={totalQuestions}
      question={questions[questionIndex]}
      answerStatus={answerStatus}
      savedAnswerIndex={answers[questionIndex]}
      isLastQuestion={isLastQuestion}
      onAnswerSelected={handleAnswerSelected}
      onNext={handleNext}
      setAnswerStatus={() => {}}
    />
  );
};

export default QuizForm;
