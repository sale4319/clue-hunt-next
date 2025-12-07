import { useCallback, useEffect, useRef, useState } from "react";

import { quizApi } from "@app/lib/client";

import { Question } from "../types";

export const useQuizProgress = (sessionId: string, questions: Question[]) => {
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<boolean | null>(null);
  const [correctAnswerCount, setCorrectAnswerCount] = useState<number>(0);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [answers, setAnswers] = useState<number[]>([]);
  const [wasLoadedAsComplete, setWasLoadedAsComplete] =
    useState<boolean>(false);
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  // Store the completion timeout ID so we can cancel it on restart
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalQuestions = questions.length;
  const isLastQuestion = questionIndex === totalQuestions - 1;

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await quizApi.getProgress(sessionId);
        const loadedAnswers = progress.answers || [];

        setAnswers(loadedAnswers);

        // Use the answers array to determine completion
        // If all questions have answers saved, it was completed
        const isFullyAnswered =
          totalQuestions > 0 &&
          loadedAnswers.length === totalQuestions &&
          loadedAnswers.length > 0;

        if (isFullyAnswered) {
          // Quiz was completed - restore completion state
          // Recalculate correctAnswers from loaded answers
          let calculatedCorrectAnswers = 0;
          for (let i = 0; i < loadedAnswers.length; i++) {
            if (loadedAnswers[i] === questions[i]?.correctAnswerIndex) {
              calculatedCorrectAnswers++;
            }
          }

          setQuizComplete(true);
          setCorrectAnswerCount(calculatedCorrectAnswers);
          setQuestionIndex(progress.currentQuestionIndex);
          setWasLoadedAsComplete(true);
        } else if (
          progress.currentQuestionIndex >= 0 &&
          loadedAnswers.length > 0
        ) {
          // Quiz in progress - restore to last question
          setQuestionIndex(progress.currentQuestionIndex);
          setCorrectAnswerCount(progress.correctAnswers);
        } else {
          // Fresh quiz
          setQuestionIndex(null);
          setCorrectAnswerCount(0);
        }
      } catch (error) {
        console.error("Failed to load quiz progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [sessionId, reloadTrigger, totalQuestions, questions]);

  // Update answer status when question changes
  useEffect(() => {
    if (questionIndex !== null && answers[questionIndex] !== undefined) {
      const savedAnswer = answers[questionIndex];
      const isCorrect =
        savedAnswer === questions[questionIndex]?.correctAnswerIndex;
      setAnswerStatus(isCorrect);
    } else {
      setAnswerStatus(null);
    }
  }, [questionIndex, answers, questions]);

  const saveProgress = useCallback(
    async (
      currentIndex: number,
      correctCount: number,
      isCompleted: boolean,
      currentAnswers: number[]
    ) => {
      try {
        await quizApi.updateProgress(sessionId, {
          currentQuestionIndex: currentIndex,
          correctAnswers: correctCount,
          totalQuestions,
          isCompleted,
          answers: currentAnswers,
        });
      } catch (error) {
        console.error("Failed to save quiz progress:", error);
      }
    },
    [sessionId, totalQuestions]
  );

  const handleAnswerSelected = useCallback(
    async (answerIndex: number) => {
      if (questionIndex === null) return;

      const newAnswers = [...answers];
      newAnswers[questionIndex] = answerIndex;
      setAnswers(newAnswers);

      const isCorrect =
        answerIndex === questions[questionIndex].correctAnswerIndex;
      const newCorrectAnswerCount = isCorrect
        ? correctAnswerCount + 1
        : correctAnswerCount;

      setCorrectAnswerCount(newCorrectAnswerCount);

      const isLastQuestionAnswered = questionIndex === totalQuestions - 1;

      await saveProgress(
        questionIndex,
        newCorrectAnswerCount,
        false,
        newAnswers
      );

      if (isLastQuestionAnswered) {
        completionTimeoutRef.current = setTimeout(() => {
          setQuizComplete(true);
        }, 1500);
      }

      return { isCorrect, isLastQuestionAnswered, newCorrectAnswerCount };
    },
    [
      questionIndex,
      answers,
      questions,
      correctAnswerCount,
      totalQuestions,
      saveProgress,
    ]
  );

  const handleNext = useCallback(async () => {
    if (isLastQuestion) {
      // Only mark complete if we have fully answered all questions
      // Check both that answers exist AND that we're actually at the last question with data
      if (answers.length === totalQuestions && totalQuestions > 0) {
        setQuizComplete(true);
      }
    } else {
      const nextIndex = questionIndex === null ? 0 : questionIndex + 1;
      setQuestionIndex(nextIndex);
      await saveProgress(nextIndex, correctAnswerCount, false, answers);
    }
  }, [
    isLastQuestion,
    questionIndex,
    correctAnswerCount,
    answers,
    saveProgress,
    totalQuestions,
  ]);

  const handleRestart = useCallback(async () => {
    try {
      // Cancel any pending completion timeout from the previous quiz
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
        completionTimeoutRef.current = null;
      }

      // Reset database
      await quizApi.resetProgress(sessionId);

      // Clear all state
      setQuizComplete(false);
      setQuestionIndex(null);
      setCorrectAnswerCount(0);
      setAnswerStatus(null);
      setAnswers([]);
      setWasLoadedAsComplete(false);
      // Force reload to get fresh state from database
      setReloadTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to reset quiz progress:", error);
    }
  }, [sessionId]);

  const handleStart = useCallback(() => {
    setQuestionIndex(0);
  }, []);

  return {
    questionIndex,
    answerStatus,
    correctAnswerCount,
    quizComplete,
    isLoading,
    answers,
    totalQuestions,
    isLastQuestion,
    wasLoadedAsComplete,
    handleAnswerSelected,
    handleNext,
    handleRestart,
    handleStart,
  };
};
