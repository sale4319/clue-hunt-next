"use client";

import { Button, QuestionForm, SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { statisticsApi } from "@app/lib/client";
import {
  LevelSixMessages,
  QuestionFormMessages,
  TooltipMessages,
} from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelSix() {
  const router = useRouter();
  const { settings } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();

  const handleSetLock = async () => {
    await statisticsApi.setLevelLock("six", true);
    await refreshStatistics();
  };

  const handleCompleteLevel = async () => {
    await statisticsApi.setLevelCompleted("six", true);
    router.push(getRoute(isQuizMode, isQuizRoute));
  };
  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  const isCompleted = statistics?.completedLevelsMap?.six || false;
  const isLocked = !isCompleted && !statistics?.levelLocks?.six;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "six" : "score";

  return (
    <>
      <Title
        titleSize="small"
        label={LevelSixMessages.HINT}
        theme={settings?.theme}
      />
      <Button
        size="medium"
        isLocked={isLocked}
        primary={isLocked}
        onClick={handleCompleteLevel}
      />
      <QuestionForm
        questionIconSize="small"
        handleUnlock={handleSetLock}
        successMessage={QuestionFormMessages.WOW}
        firstQuestion={QuestionFormMessages.FIRST_Q_LABEL}
        firstHint={TooltipMessages.FIRST_Q_HINT}
        firstPlaceholder={QuestionFormMessages.FIRST_Q_PLACEHOLDER}
        secondQuestion={QuestionFormMessages.SECOND_Q_LABEL}
        secondHint={TooltipMessages.SECOND_Q_HINT}
        secondPlaceholder={QuestionFormMessages.SECOND_Q_PLACEHOLDER}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
