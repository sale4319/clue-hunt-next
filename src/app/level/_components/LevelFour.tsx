"use client";

import { useState } from "react";
import { Button, Title, SkipButton, ShiftingCircles } from "clue-hunt-ui";
import { getRoute } from "@app/utils";
import { LevelFourMessages } from "@app/messages-contract";
import { SettingsType } from "./types";

export default function LevelFour({ theme, quizMode, skipMode }: SettingsType) {
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "five" : "five";

  return (
    <>
      <Title titleSize="medium" label={LevelFourMessages.HINT} theme={theme} />
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
      />

      <ShiftingCircles handleUnlockNavigation={handleUnlock} theme={theme} />

      {skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
