"use client";

import {
  Button,
  DraggingPuzzle,
  SkipButton,
  SpacerElement,
  Title,
} from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { statisticsApi } from "@app/lib/client";
import { LevelThreeMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelThree() {
  const router = useRouter();
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();

  const isCompleted = statistics?.completedLevelsMap?.three || false;
  const isLocked = !isCompleted && !statistics?.levelLocks?.three;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "three" : "four";

  const handleSetLock = async () => {
    await statisticsApi.setLevelLock("three", true);
    await refreshStatistics();
  };

  const handleCompleteLevel = async () => {
    await statisticsApi.setLevelCompleted("three", true);
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  return (
    <>
      <SpacerElement size="small" />
      <Title
        titleSize="medium"
        label={LevelThreeMessages.HINT}
        theme={settings?.theme}
      />
      <Button
        size="medium"
        isLocked={isLocked}
        primary={isLocked}
        onClick={handleCompleteLevel}
      />
      <DraggingPuzzle
        handleUnlockNavigation={handleSetLock}
        theme={settings?.theme}
      />
      {settings?.skipMode && (
        <SkipButton onClick={handleSkip} disabled={!isTimerStarted} />
      )}
    </>
  );
}
