"use client";

import { SkipButton } from "clue-hunt-ui";
import { useRouter } from "next/navigation";
import { statisticsApi } from "src/shared/lib/src/api/statistics";

import { useSettings } from "@app/context/client";
import { QuizForm } from "@app/quiz-form";
import { questionSetTwo } from "@app/quiz-sets-contract";
import { getRoute } from "@app/utils";

export default function QuizTwo() {
  const router = useRouter();
  const { settings, isTimerStarted } = useSettings();

  const handleUnlock = async () => {
    router.push(getRoute("level", "three"));
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute("level", "three"));
  };

  return (
    <>
      <QuizForm
        sessionId="quiz-2"
        quizName="two"
        questions={questionSetTwo}
        handleUnlock={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && (
        <SkipButton onClick={handleSkip} disabled={!isTimerStarted} />
      )}
    </>
  );
}
