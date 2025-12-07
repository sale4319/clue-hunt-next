"use client";

import { useState } from "react";
import { Button, ShiftingCircles, SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { useRefreshOnPageShow } from "@app/hooks";
import { LevelCompleted } from "@app/level-completed";
import { statisticsApi } from "@app/lib/client";
import { LevelFourMessages } from "@app/messages-contract";
import { getRouteWithProgress, getRouteWithSkip } from "@app/utils";

import {
  completeAndNavigate,
  skipAndNavigate,
} from "../_utils/optimizedNavigation";

export default function LevelFour() {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(true);
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();
  useRefreshOnPageShow(refreshStatistics);

  const isCompleted = statistics?.completedLevelsMap?.four || false;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "four" : "five";

  const handleSetLock = async () => {
    setIsLocked(false);
    await refreshStatistics();
  };

  const handleCompleteLevel = () => {
    completeAndNavigate(
      "four",
      () => statisticsApi.setLevelCompleted("four", true),
      router.push,
      getRouteWithProgress(isQuizMode, isQuizRoute)
    );
  };

  const handleCompleteLevelAsync = async () => {
    handleCompleteLevel();
  };

  const handleSkip = () => {
    skipAndNavigate(
      () => statisticsApi.incrementSkipButtonClicks(),
      router.push,
      getRouteWithSkip(isQuizMode, isQuizRoute)
    );
  };
  return (
    <>
      {isCompleted ? (
        <LevelCompleted handleContinue={handleCompleteLevelAsync} />
      ) : (
        <>
          <Title
            titleSize="medium"
            label={LevelFourMessages.HINT}
            theme={settings?.theme}
            align="center"
          />
          <Button
            size="medium"
            isLocked={isLocked}
            primary={isLocked}
            onClick={handleCompleteLevel}
          />

          <ShiftingCircles
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
