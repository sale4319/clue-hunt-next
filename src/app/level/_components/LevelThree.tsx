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
import { useGameSettings } from "@app/context";

export default function LevelThree() {
  const { darkMode } = useGameSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
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
        href={getRoute("quiz", "three")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <DraggingPuzzle
        handleUnlockNavigation={handleUnlock}
        darkMode={darkMode}
      />
      <SkipButton onClick={handleUnlock} />
    </>
  );
}
