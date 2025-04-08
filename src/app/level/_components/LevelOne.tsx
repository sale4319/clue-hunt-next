"use client";

import { useState } from "react";
import {
  Button,
  SpacerElement,
  UnlockButton,
  Title,
  SkipButton,
} from "clue-hunt-ui";
import { getRoute } from "@app/utils";
import { useGameSettings } from "@app/context";
import { LevelOneMessages } from "@app/messages-contract";

export default function LevelOne() {
  const { darkMode, skipMode, quizMode } = useGameSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "one" : "two";

  return (
    <>
      <SpacerElement size="medium">
        <UnlockButton
          data-testid="unlockButton"
          onClick={handleUnlock}
          label={LevelOneMessages.UNLOCK}
        />
      </SpacerElement>
      <Title label={LevelOneMessages.HINT} theme={darkMode} />
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
