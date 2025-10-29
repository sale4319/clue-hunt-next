"use client";

import { useState } from "react";
import {
  Button,
  SkipButton,
  SpacerElement,
  Title,
  UnlockToolTip,
} from "clue-hunt-ui";

import { useSettings } from "@app/context";
import { LevelTwoMessages, TooltipMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelTwo() {
  const { settings } = useSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "two" : "three";

  return (
    <>
      <SpacerElement size="medium">
        <UnlockToolTip
          content={TooltipMessages.LEVEL_TWO_CONGRATS}
          onClick={handleUnlock}
          data-testid="unlockButton"
        />
      </SpacerElement>
      <Title label={LevelTwoMessages.HINT} theme={settings?.theme} />
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
      />
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
