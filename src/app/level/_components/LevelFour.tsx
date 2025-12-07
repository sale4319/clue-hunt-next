"use client";

import { useState } from "react";
import { Button, ShiftingCircles, SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { LevelCompleted } from "@app/level-completed";
import { statisticsApi } from "@app/lib/client";
import { LevelFourMessages } from "@app/messages-contract";
import { getRouteWithProgress, getRouteWithSkip } from "@app/utils";

export default function LevelFour() {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(true);
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();

  const isCompleted = statistics?.completedLevelsMap?.four || false;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "four" : "five";

  const handleSetLock = async () => {
    setIsLocked(false);
    await refreshStatistics();
  };

  const handleCompleteLevel = async () => {
    await statisticsApi.setLevelCompleted("four", true);
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
