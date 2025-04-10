"use client";

import { useState } from "react";
import {
  Button,
  SpacerElement,
  Title,
  SkipButton,
  UnlockToolTip,
} from "clue-hunt-ui";
import { getRoute } from "@app/utils";
import { LevelTwoMessages, TooltipMessages } from "@app/messages-contract";
import { SettingsType } from "./types";

export default function LevelTwo({ theme, quizMode, skipMode }: SettingsType) {
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "two" : "three";

  return (
    <>
      <SpacerElement size="medium">
        <UnlockToolTip
          content={TooltipMessages.LEVEL_TWO_CONGRATS}
          onClick={handleUnlock}
          data-testid="unlockButton"
        />
      </SpacerElement>
      <Title label={LevelTwoMessages.HINT} theme={theme} />
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
      />
      {skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
