"use client";

import { SkipButton } from "clue-hunt-ui";
import { useRouter } from "next/navigation";
import { statisticsApi } from "src/shared/lib/src/api/statistics";

import { useSettings } from "@app/context/client";
import { QuizForm } from "@app/quiz-form";
import { questionSetSix } from "@app/quiz-sets-contract";
import { getRouteWithProgress,getRouteWithSkip } from "@app/utils";

export default function QuizSix() {
  const router = useRouter();
  const { settings, isTimerStarted } = useSettings();

  const handleUnlock = async () => {
    router.push(getRouteWithProgress("level", "score"));
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRouteWithSkip("level", "score"));
  };

  return (
    <>
      <QuizForm
        sessionId="quiz-6"
        quizName="six"
        questions={questionSetSix}
        handleUnlock={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && (
        <SkipButton onClick={handleSkip} disabled={!isTimerStarted} />
      )}
    </>
  );
}
