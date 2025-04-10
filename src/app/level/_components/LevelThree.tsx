"use client";

import { useState } from "react";
import {
  Button,
  SpacerElement,
  Title,
  SkipButton,
  DraggingPuzzle,
} from "clue-hunt-ui";
import { getRoute } from "@app/utils";
import { LevelThreeMessages } from "@app/messages-contract";
import { SettingsType } from "./types";

export default function LevelThree({
  theme,
  quizMode,
  skipMode,
}: SettingsType) {
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "three" : "four";

  return (
    <>
      <SpacerElement size="small" />
      <Title titleSize="medium" label={LevelThreeMessages.HINT} theme={theme} />
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
      />
      <DraggingPuzzle handleUnlockNavigation={handleUnlock} theme={theme} />
      {skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
