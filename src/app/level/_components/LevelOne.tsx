"use client";

import {
  Button,
  SkipButton,
  SpacerElement,
  Title,
  UnlockButton,
} from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { statisticsApi } from "@app/lib/client";
import { LevelOneMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelOne() {
  const router = useRouter();
  const { settings } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();

  const isCompleted = statistics?.completedLevelsMap?.one || false;
  const isLocked = !isCompleted && !statistics?.levelLocks?.one;
  const quizMode = settings?.quizMode;
  const skipMode = settings?.skipMode;
  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "one" : "two";

  const handleSetLock = async () => {
    await statisticsApi.setLevelLock("one", true);
    await refreshStatistics();
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  const handleCompleteLevel = async () => {
    await statisticsApi.setLevelCompleted("one", true);
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  return (
    <>
      <SpacerElement size="medium">
        <UnlockButton
          data-testid="unlockButton"
          onClick={handleSetLock}
          label={LevelOneMessages.UNLOCK}
        />
      </SpacerElement>
      <Title label={LevelOneMessages.HINT} theme={settings?.theme} />
      <Button
        size="medium"
        isLocked={isLocked}
        primary={isLocked}
        onClick={handleCompleteLevel}
      />
      {skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
