"use client";

import { SkipButton } from "clue-hunt-ui";
import { useRouter } from "next/navigation";
import { statisticsApi } from "src/shared/lib/src/api/statistics";

import { useSettings } from "@app/context/client";
import { QuizForm } from "@app/quiz-form";
import { questionSetFive } from "@app/quiz-sets-contract";
import { getRoute } from "@app/utils";

export default function QuizFive() {
  const router = useRouter();
  const { settings } = useSettings();

  const handleUnlock = async () => {
    router.push(getRoute("level", "six"));
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute("level", "six"));
  };

  return (
    <>
      <QuizForm
        sessionId="quiz-5"
        quizName="five"
        questions={questionSetFive}
        handleUnlock={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
