"use client";

import {
  Button,
  SkipButton,
  SpacerElement,
  Title,
  UnlockButton,
} from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { settingsApi } from "@app/lib/client";
import { LevelOneMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelOne() {
  const { settings, refreshSettings } = useSettings();

  const isLocked = !settings?.isLocked;
  const quizMode = settings?.quizMode;
  const skipMode = settings?.skipMode;
  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "one" : "two";

  const handleSetLock = async () => {
    await settingsApi.setLock(true);
    await refreshSettings();
  };

  const handleDeleteLock = async () => {
    await settingsApi.setLock(false);
    await refreshSettings();
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
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
        onClick={handleDeleteLock}
      />
      {skipMode && <SkipButton onClick={handleSetLock} />}
    </>
  );
}
