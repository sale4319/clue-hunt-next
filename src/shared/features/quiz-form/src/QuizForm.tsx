"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "clue-hunt-ui";

import { quizApi } from "@app/lib/client";
import { QuizFormMessages } from "@app/messages-contract";

import { ProgressBar, QuestionComponent } from "./components/";

import styles from "./QuizForm.module.css";

type Question = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

type QuizProps = {
  sessionId: string;
  questions?: Question[];
  handleUnlock?: () => void;
  theme?: string;
};

// Quiz Component
const QuizForm: React.FC<QuizProps> = ({
  sessionId,
  theme = "dark",
  questions = [],
  handleUnlock,
}) => {
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<boolean | null>(null);
  const [correctAnswerCount, setCorrectAnswerCount] = useState<number>(0);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const totalQuestions = questions.length;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const isPerfectScore = correctAnswerCount === totalQuestions;

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await quizApi.getProgress(sessionId);

        if (progress.isCompleted) {
          setQuizComplete(true);
          setCorrectAnswerCount(progress.correctAnswers);
          setQuestionIndex(progress.currentQuestionIndex);
        } else if (progress.currentQuestionIndex > 0) {
          setQuestionIndex(progress.currentQuestionIndex);
          setCorrectAnswerCount(progress.correctAnswers);
        }
      } catch (error) {
        console.error("Failed to load quiz progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [sessionId]);

  useEffect(() => {
    setAnswerStatus(null);
  }, [questionIndex]);

  useEffect(() => {
    if (answerStatus) {
      setCorrectAnswerCount((count) => count + 1);
    }
  }, [answerStatus]);

  // Save progress when answer is given
  useEffect(() => {
    const saveProgress = async () => {
      if (questionIndex !== null && !isLoading) {
        try {
          await quizApi.updateProgress(sessionId, {
            currentQuestionIndex: questionIndex,
            correctAnswers: correctAnswerCount,
            totalQuestions,
            isCompleted: quizComplete,
          });
        } catch (error) {
          console.error("Failed to save quiz progress:", error);
        }
      }
    };

    saveProgress();
  }, [
    sessionId,
    questionIndex,
    correctAnswerCount,
    quizComplete,
    totalQuestions,
    isLoading,
  ]);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      setQuizComplete(true);
    } else {
      setQuestionIndex((prev) => (prev === null ? 0 : prev + 1));
    }
  }, [isLastQuestion]);

  const handleRestart = useCallback(async () => {
    try {
      await quizApi.resetProgress(sessionId);
      setQuizComplete(false);
      setQuestionIndex(null);
      setCorrectAnswerCount(0);
      setAnswerStatus(null);
    } catch (error) {
      console.error("Failed to reset quiz progress:", error);
    }
  }, [sessionId]);

  const handleStart = useCallback(() => {
    setQuestionIndex(0);
  }, []);

  if (isLoading) {
    return (
      <div className={[styles.quiz, styles[theme]].join(" ")}>
        <p>Loading quiz...</p>
      </div>
    );
  }

  // Quiz not started yet
  if (questionIndex === null) {
    return (
      <div className={[styles.quiz, styles[theme]].join(" ")}>
        <h1>{QuizFormMessages.TITLE}</h1>
        <p>{QuizFormMessages.DESCRIPTION}</p>
        <p>
          <Button
            mode="up"
            onClick={handleStart}
            label={QuizFormMessages.START_BUTTON}
            size="medium"
          />
        </p>
      </div>
    );
  }

  // Quiz completed
  if (quizComplete) {
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
              onClick={handleUnlock}
              label={QuizFormMessages.UNLOCK_BUTTON}
              size="medium"
            />
          </p>
        ) : (
          <p>
            <Button
              mode="raise"
              onClick={handleRestart}
              label={QuizFormMessages.RESTART_BUTTON}
              size="medium"
            />
          </p>
        )}
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className={[styles.quiz, styles[theme]].join(" ")}>
      <ProgressBar
        currentQuestionIndex={questionIndex}
        totalQuestionsCount={totalQuestions}
      />
      <QuestionComponent
        question={questions[questionIndex]}
        setAnswerStatus={setAnswerStatus}
      />
      {answerStatus !== null && (
        <div>
          <Button
            mode="slide"
            onClick={handleNext}
            size="medium"
            label={
              isLastQuestion
                ? QuizFormMessages.RESULTS_BUTTON
                : QuizFormMessages.NEXT_BUTTON
            }
          />
        </div>
      )}
    </div>
  );
};

export default QuizForm;
