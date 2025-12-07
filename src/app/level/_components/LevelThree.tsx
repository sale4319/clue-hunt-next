"use client";

import { useState } from "react";
import {
  Button,
  DraggingPuzzle,
  SkipButton,
  SpacerElement,
  Title,
} from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { useRefreshOnPageShow } from "@app/hooks";
import { LevelCompleted } from "@app/level-completed";
import { statisticsApi } from "@app/lib/client";
import { LevelThreeMessages } from "@app/messages-contract";
import { getRouteWithProgress, getRouteWithSkip } from "@app/utils";

export default function LevelThree() {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(true);
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();
  useRefreshOnPageShow(refreshStatistics);

  const isCompleted = statistics?.completedLevelsMap?.three || false;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "three" : "four";

  const handleSetLock = async () => {
    setIsLocked(false);
    await refreshStatistics();
  };

  const handleCompleteLevel = async () => {
    await statisticsApi.setLevelCompleted("three", true);
    router.push(getRouteWithProgress(isQuizMode, isQuizRoute));
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRouteWithSkip(isQuizMode, isQuizRoute));
  };

  return (
    <>
      {isCompleted ? (
        <LevelCompleted handleContinue={handleCompleteLevel} />
      ) : (
        <>
          <SpacerElement size="small" />
          <Title
            titleSize="medium"
            label={LevelThreeMessages.HINT}
            theme={settings?.theme}
            align="center"
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
        </>
      )}
      {settings?.skipMode && (
        <SkipButton
          onClick={handleSkip}
          disabled={!isTimerStarted}
          theme={settings?.theme}
        />
      )}
    </>
  );
}
