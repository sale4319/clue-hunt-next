"use client";

import { useState } from "react";
import { Button, QuizForm, SkipButton } from "clue-hunt-ui";
import { useGameSettings } from "@app/context";
import { getRoute } from "@app/utils";
import { questionSetFour } from "@app/quiz-sets-contract";

export default function QuizThree() {
  const { darkMode } = useGameSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  return (
    <>
      <Button
        size="medium"
        href={getRoute("level", "four")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <QuizForm
        questions={questionSetFour}
        handleUnlock={handleUnlock}
        darkMode={darkMode}
      />
      <SkipButton onClick={handleUnlock} />
    </>
  );
}
