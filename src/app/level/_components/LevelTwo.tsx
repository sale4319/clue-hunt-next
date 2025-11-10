"use client";

import {
  Button,
  SkipButton,
  SpacerElement,
  Title,
  UnlockToolTip,
} from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { settingsApi, statisticsApi } from "@app/lib/client";
import { LevelTwoMessages, TooltipMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelTwo() {
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
  const isQuizRoute = settings?.quizMode ? "two" : "three";

  return (
    <>
      <SpacerElement size="medium">
        <UnlockToolTip
          content={TooltipMessages.LEVEL_TWO_CONGRATS}
          onClick={handleSetLock}
          data-testid="unlockButton"
        />
      </SpacerElement>
      <Title label={LevelTwoMessages.HINT} theme={settings?.theme} />
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
        onClick={handleDeleteLock}
      />
      {settings?.skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
