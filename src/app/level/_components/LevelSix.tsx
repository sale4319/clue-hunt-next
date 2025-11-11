"use client";

import { SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { statisticsApi } from "@app/lib/client";
import {
  LevelSixMessages,
  QuestionFormMessages,
  TooltipMessages,
} from "@app/messages-contract";
import { QuestionForm } from "@app/question-form";
import { getRoute } from "@app/utils";

export default function LevelSix() {
  const router = useRouter();
  const { settings, isTimerStarted } = useSettings();
  const { refreshStatistics } = useStatistics();

  const handleUnlock = async () => {
    await statisticsApi.setLevelCompleted("six", true);
    router.push(getRoute(isQuizMode, isQuizRoute));
    await refreshStatistics();
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "six" : "score";

  return (
    <>
      <Title
        titleSize="small"
        label={LevelSixMessages.HINT}
        theme={settings?.theme}
      />

      <QuestionForm
        questionIconSize="small"
        handleUnlock={handleUnlock}
        successMessage={QuestionFormMessages.WOW}
        firstQuestion={QuestionFormMessages.FIRST_Q_LABEL}
        firstHint={TooltipMessages.FIRST_Q_HINT}
        firstPlaceholder={QuestionFormMessages.FIRST_Q_PLACEHOLDER}
        secondQuestion={QuestionFormMessages.SECOND_Q_LABEL}
        secondHint={TooltipMessages.SECOND_Q_HINT}
        secondPlaceholder={QuestionFormMessages.SECOND_Q_PLACEHOLDER}
        theme={settings?.theme}
      />
      {settings?.skipMode && (
        <SkipButton onClick={handleSkip} disabled={!isTimerStarted} />
      )}
    </>
  );
}
