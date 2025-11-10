"use client";

import {
  Button,
  DraggingPuzzle,
  SkipButton,
  SpacerElement,
  Title,
} from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { settingsApi, statisticsApi } from "@app/lib/client";
import { LevelThreeMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelThree() {
  const { settings, refreshSettings } = useSettings();

  const handleSetLock = async () => {
    await settingsApi.setLock(true);
    await refreshSettings();
  };

  const handleDeleteLock = async () => {
    await settingsApi.setLock(false);
    await refreshSettings();
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    await settingsApi.setLock(true);
    await refreshSettings();
  };

  const isLocked = !settings?.isLocked;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "three" : "four";

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
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
        onClick={handleDeleteLock}
      />
      <DraggingPuzzle
        handleUnlockNavigation={handleSetLock}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
