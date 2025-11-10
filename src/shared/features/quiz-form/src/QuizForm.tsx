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
  const [answers, setAnswers] = useState<number[]>([]); // Store all answers

  const totalQuestions = questions.length;
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const isPerfectScore = correctAnswerCount === totalQuestions;

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await quizApi.getProgress(sessionId);

        // Always load answers first
        const loadedAnswers = progress.answers || [];
        setAnswers(loadedAnswers);

        if (progress.isCompleted) {
          setQuizComplete(true);
          setCorrectAnswerCount(progress.correctAnswers);
          setQuestionIndex(progress.currentQuestionIndex);
        } else if (
          progress.currentQuestionIndex >= 0 &&
          (progress.answers?.length > 0 || progress.correctAnswers > 0)
        ) {
          // If there's any progress (answers saved or questions answered), restore position
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
    // Reset answer status when moving to a new question
    // But set it if we already have an answer for this question
    if (questionIndex !== null && answers[questionIndex] !== undefined) {
      const savedAnswer = answers[questionIndex];
      const isCorrect =
        savedAnswer === questions[questionIndex]?.correctAnswerIndex;
      setAnswerStatus(isCorrect);
    } else {
      setAnswerStatus(null);
    }
  }, [questionIndex, answers, questions]);

  // Save progress when quiz is completed or question index changes (but not for every answer)
  useEffect(() => {
    const saveProgress = async () => {
      if (questionIndex !== null && !isLoading && quizComplete) {
        // Only auto-save when quiz is completed
        try {
          await quizApi.updateProgress(sessionId, {
            currentQuestionIndex: questionIndex,
            correctAnswers: correctAnswerCount,
            totalQuestions,
            isCompleted: quizComplete,
            answers,
          });
        } catch (error) {
          console.error("Failed to save quiz progress:", error);
        }
      }
    };

    saveProgress();
  }, [
    sessionId,
    quizComplete, // Only save when quiz completes
    isLoading,
  ]);

  const handleAnswerSelected = useCallback(
    async (answerIndex: number) => {
      if (questionIndex === null) return;

      // Update the answers array
      const newAnswers = [...answers];
      newAnswers[questionIndex] = answerIndex;
      setAnswers(newAnswers);

      // Check if answer is correct and update count
      const isCorrect =
        answerIndex === questions[questionIndex].correctAnswerIndex;
      if (isCorrect) {
        setCorrectAnswerCount((count) => count + 1);
      }

      // Save immediately to database
      try {
        await quizApi.updateProgress(sessionId, {
          currentQuestionIndex: questionIndex,
          correctAnswers: isCorrect
            ? correctAnswerCount + 1
            : correctAnswerCount,
          totalQuestions,
          isCompleted: quizComplete,
          answers: newAnswers,
        });
      } catch (error) {
        console.error("Failed to save answer:", error);
      }
    },
    [
      questionIndex,
      answers,
      questions,
      correctAnswerCount,
      sessionId,
      totalQuestions,
      quizComplete,
    ]
  );

  const handleNext = useCallback(async () => {
    if (isLastQuestion) {
      setQuizComplete(true);
    } else {
      const nextIndex = questionIndex === null ? 0 : questionIndex + 1;
      setQuestionIndex(nextIndex);

      // Save progress when moving to next question
      try {
        await quizApi.updateProgress(sessionId, {
          currentQuestionIndex: nextIndex,
          correctAnswers: correctAnswerCount,
          totalQuestions,
          isCompleted: false,
          answers,
        });
      } catch (error) {
        console.error("Failed to save progress on next:", error);
      }
    }
  }, [
    isLastQuestion,
    questionIndex,
    sessionId,
    correctAnswerCount,
    totalQuestions,
    answers,
  ]);

  const handleRestart = useCallback(async () => {
    try {
      await quizApi.resetProgress(sessionId);
      setQuizComplete(false);
      setQuestionIndex(null);
      setCorrectAnswerCount(0);
      setAnswerStatus(null);
      setAnswers([]); // Clear saved answers
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
        savedAnswerIndex={answers[questionIndex]}
        onAnswerSelected={handleAnswerSelected}
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
