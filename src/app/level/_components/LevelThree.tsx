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
import { useGameSettings } from "@app/context";
import { LevelThreeMessages } from "@app/messages-contract";

export default function LevelThree() {
  const { darkMode, skipMode, quizMode } = useGameSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "three" : "four";

  return (
    <>
      <SpacerElement size="small" />
      <Title
        titleSize="medium"
        label={LevelThreeMessages.HINT}
        theme={darkMode}
      />
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
      />
      <DraggingPuzzle
        handleUnlockNavigation={handleUnlock}
        darkMode={darkMode}
      />
      {skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
