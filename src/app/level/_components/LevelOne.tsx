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
import { LevelOneMessages } from "@app/messages-contract";
import { useGameSettings } from "@app/context";

export default function LevelOne() {
  const { darkMode } = useGameSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
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
        href={getRoute("quiz", "one")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <SkipButton onClick={handleUnlock} />
    </>
  );
}
