import { useCallback, useEffect, useState } from "react";

import { quizApi } from "@app/lib/client";

import { Question } from "../types";

export const useQuizProgress = (sessionId: string, questions: Question[]) => {
  const [questionIndex, setQuestionIndex] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<boolean | null>(null);
  const [correctAnswerCount, setCorrectAnswerCount] = useState<number>(0);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [answers, setAnswers] = useState<number[]>([]);
  const [wasLoadedAsComplete, setWasLoadedAsComplete] = useState<boolean>(false);

  const totalQuestions = questions.length;
  const isLastQuestion = questionIndex === totalQuestions - 1;

  // Load progress on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await quizApi.getProgress(sessionId);
        const loadedAnswers = progress.answers || [];
        setAnswers(loadedAnswers);

        if (progress.isCompleted) {
          setQuizComplete(true);
          setCorrectAnswerCount(progress.correctAnswers);
          setQuestionIndex(progress.currentQuestionIndex);
          setWasLoadedAsComplete(true);
        } else if (
          progress.currentQuestionIndex >= 0 &&
          (progress.answers?.length > 0 || progress.correctAnswers > 0)
        ) {
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

      if (isCorrect) {
        setCorrectAnswerCount(newCorrectAnswerCount);
      }

      const isLastQuestionAnswered = questionIndex === totalQuestions - 1;

      await saveProgress(
        questionIndex,
        newCorrectAnswerCount,
        isLastQuestionAnswered,
        newAnswers
      );

      if (isLastQuestionAnswered) {
        setTimeout(() => {
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
      setQuizComplete(true);
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
  ]);

  const handleRestart = useCallback(async () => {
    try {
      await quizApi.resetProgress(sessionId);
      setQuizComplete(false);
      setQuestionIndex(null);
      setCorrectAnswerCount(0);
      setAnswerStatus(null);
      setAnswers([]);
      setWasLoadedAsComplete(false);
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
