"use client";

import {
  Button,
  SkipButton,
  SpacerElement,
  Title,
  UnlockToolTip,
} from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { statisticsApi } from "@app/lib/client";
import { LevelTwoMessages, TooltipMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelTwo() {
  const router = useRouter();
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();

  const isCompleted = statistics?.completedLevelsMap?.two || false;
  const isLocked = !isCompleted && !statistics?.levelLocks?.two;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "two" : "three";

  const handleSetLock = async () => {
    await statisticsApi.setLevelLock("two", true);
    await refreshStatistics();
  };

  const handleCompleteLevel = async () => {
    await statisticsApi.setLevelCompleted("two", true);
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  return (
    <>
      <SpacerElement size="medium">
        <UnlockToolTip
          content={TooltipMessages.LEVEL_TWO_CONGRATS}
          onClick={handleSetLock}
          data-testid="unlockButton"
        />
      </SpacerElement>
      <Title
        label={LevelTwoMessages.HINT}
        theme={settings?.theme}
        align="center"
      />
      <Button
        size="medium"
        isLocked={isLocked}
        primary={isLocked}
        onClick={handleCompleteLevel}
      />
      {settings?.skipMode && (
        <SkipButton onClick={handleSkip} disabled={!isTimerStarted} />
      )}
    </>
  );
}
