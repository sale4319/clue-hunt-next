"use client";

import { SkipButton } from "clue-hunt-ui";
import { useRouter } from "next/navigation";
import { statisticsApi } from "src/shared/lib/src/api/statistics";

import { useSettings } from "@app/context/client";
import { QuizForm } from "@app/quiz-form";
import { questionSetThree } from "@app/quiz-sets-contract";
import { getRoute } from "@app/utils";

export default function QuizThree() {
  const router = useRouter();
  const { settings } = useSettings();

  const handleUnlock = async () => {
    router.push(getRoute("level", "four"));
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute("level", "four"));
  };

  return (
    <>
      <QuizForm
        sessionId="quiz-3"
        quizName="three"
        questions={questionSetThree}
        handleUnlock={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
