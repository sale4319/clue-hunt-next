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
import { useSettings } from "@app/context";

export default function LevelThree() {
  const { settings } = useSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
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
      />
      <DraggingPuzzle
        handleUnlockNavigation={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
