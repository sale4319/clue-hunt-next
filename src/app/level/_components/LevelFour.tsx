"use client";

import { useState } from "react";
import { Button, ShiftingCircles, SkipButton, Title } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { LevelFourMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelFour() {
  const { settings } = useSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "four" : "five";

  return (
    <>
      <Title
        titleSize="medium"
        label={LevelFourMessages.HINT}
        theme={settings?.theme}
      />
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
      />

      <ShiftingCircles
        handleUnlockNavigation={handleUnlock}
        theme={settings?.theme}
      />

      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
