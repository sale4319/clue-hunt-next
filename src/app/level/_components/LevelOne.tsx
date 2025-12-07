"use client";

import { useState } from "react";
import {
  Button,
  SkipButton,
  SpacerElement,
  Title,
  UnlockButton,
} from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { useRefreshOnPageShow } from "@app/hooks";
import { LevelCompleted } from "@app/level-completed";
import { statisticsApi } from "@app/lib/client";
import { LevelOneMessages } from "@app/messages-contract";
import { getRouteWithProgress, getRouteWithSkip } from "@app/utils";

export default function LevelOne() {
  const router = useRouter();

  const [isLocked, setIsLocked] = useState(true);
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();
  useRefreshOnPageShow(refreshStatistics);

  const isCompleted = statistics?.completedLevelsMap?.one || false;
  const quizMode = settings?.quizMode;
  const skipMode = settings?.skipMode;
  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "one" : "two";

  const handleSetLock = async () => {
    setIsLocked(false);
    await refreshStatistics();
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRouteWithSkip(isQuizMode, isQuizRoute));
  };

  const handleCompleteLevel = async () => {
    await statisticsApi.setLevelCompleted("one", true);
    router.push(getRouteWithProgress(isQuizMode, isQuizRoute));
  };

  return (
    <>
      {isCompleted ? (
        <LevelCompleted handleContinue={handleCompleteLevel} />
      ) : (
        <>
          <SpacerElement size="medium">
            <UnlockButton
              data-testid="unlockButton"
              onClick={handleSetLock}
              label={LevelOneMessages.UNLOCK}
            />
          </SpacerElement>
          <Title
            label={LevelOneMessages.HINT}
            theme={settings?.theme}
            align="center"
          />
          <Button
            size="medium"
            isLocked={isLocked}
            primary={isLocked}
            onClick={handleCompleteLevel}
          />
        </>
      )}
      {skipMode && (
        <SkipButton
          onClick={handleSkip}
          disabled={!isTimerStarted}
          theme={settings?.theme}
        />
      )}
    </>
  );
}
