"use client";

import { useState } from "react";
import { Button, QuizForm, SkipButton } from "clue-hunt-ui";
import { useGameSettings } from "@app/context";
import { getRoute } from "@app/utils";
import { questionSetThree } from "@app/quiz-sets-contract";

export default function QuizTwo() {
  const { darkMode, skipMode } = useGameSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  return (
    <>
      <Button
        size="medium"
        href={getRoute("level", "three")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <QuizForm
        questions={questionSetThree}
        handleUnlock={handleUnlock}
        darkMode={darkMode}
      />
      {skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
