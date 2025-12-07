import { useCallback, useEffect, useState } from "react";

import { statisticsApi } from "@app/lib/client";

import { QuizName } from "../types";

export const useStatisticsTracking = (
  quizName: QuizName,
  quizComplete: boolean,
  correctAnswerCount: number,
  totalQuestions: number,
  isLoading: boolean,
  wasLoadedAsComplete: boolean
) => {
  const [statisticsTracked, setStatisticsTracked] = useState<boolean>(false);

  const isPerfectScore = correctAnswerCount === totalQuestions;

  // Reset statistics tracking when quiz is restarted (when questionIndex becomes null in parent)
  useEffect(() => {
    // Reset tracking if quiz is not complete and not loading - indicates a restart
    if (!quizComplete && !isLoading) {
      setStatisticsTracked(false);
    }
  }, [quizComplete, isLoading]);

  useEffect(() => {
    const trackStatistics = async () => {
      if (
        quizComplete &&
        !isLoading &&
        !statisticsTracked &&
        totalQuestions > 0 &&
        correctAnswerCount > 0
      ) {
        try {
          // Always mark quiz as completed
          await statisticsApi.setQuizCompleted(quizName, true);

          // Track incorrect answers if not perfect (but only if not previously loaded as complete)
          if (!isPerfectScore && !wasLoadedAsComplete) {
            const incorrectCount = totalQuestions - correctAnswerCount;
            if (incorrectCount > 0) {
              await statisticsApi.incrementIncorrectAnswers(incorrectCount);
            }
          }
          setStatisticsTracked(true);
        } catch (error) {
          console.error("Failed to track statistics:", error);
        }
      }
    };

    trackStatistics();
  }, [
    quizComplete,
    isLoading,
    statisticsTracked,
    wasLoadedAsComplete,
    quizName,
    isPerfectScore,
    correctAnswerCount,
    totalQuestions,
  ]);

  const trackImmediateStatistics = useCallback(
    async (correctCount: number, total: number) => {
      if (statisticsTracked) return;

      try {
        // Always mark quiz as completed
        await statisticsApi.setQuizCompleted(quizName, true);

        // Track incorrect answers if not perfect
        const isPerfect = correctCount === total;
        if (!isPerfect) {
          const incorrectCount = total - correctCount;
          if (incorrectCount > 0) {
            await statisticsApi.incrementIncorrectAnswers(incorrectCount);
          }
        }
        setStatisticsTracked(true);
      } catch (error) {
        console.error("Failed to track immediate statistics:", error);
      }
    },
    [quizName, statisticsTracked]
  );

  const resetTracking = useCallback(() => {
    setStatisticsTracked(false);
  }, []);

  return {
    statisticsTracked,
    isPerfectScore,
    trackImmediateStatistics,
    resetTracking,
  };
};
