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
import { useGameSettings } from "@app/context";

export default function LevelTwo() {
  const { darkMode } = useGameSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  return (
    <>
      <SpacerElement size="medium">
        <UnlockToolTip
          content={TooltipMessages.LEVEL_TWO_CONGRATS}
          onClick={handleUnlock}
          data-testid="unlockButton"
        />
      </SpacerElement>
      <Title label={LevelTwoMessages.HINT} theme={darkMode} />
      <Button
        size="medium"
        href={getRoute("quiz", "two")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <SkipButton onClick={handleUnlock} />
    </>
  );
}
