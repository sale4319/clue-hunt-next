"use client";

import {
  Button,
  SpacerElement,
  UnlockButton,
  Title,
  SkipButton,
} from "clue-hunt-ui";
import { getRoute } from "@app/utils";

import { LevelOneMessages } from "@app/messages-contract";
import { getClientSessionId } from "src/shared/lib/clientSession";
import { settingsApi } from "src/shared/lib/api/settings";
import { useSettings } from "@app/context";

export default function LevelOne() {
  const { settings, refreshSettings } = useSettings();

  const isLocked = !settings?.isLocked;
  const quizMode = settings?.quizMode;
  const skipMode = settings?.skipMode;
  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "one" : "two";

  const handleSetLock = async () => {
    const sessionId = getClientSessionId();
    await settingsApi.setLock(sessionId, true);
    await refreshSettings();
  };

  const handleDeleteLock = async () => {
    const sessionId = getClientSessionId();
    await settingsApi.setLock(sessionId, false);
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
