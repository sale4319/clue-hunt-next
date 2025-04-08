"use client";

import { useState } from "react";
import { useGameSettings } from "@app/context";
import { getRoute } from "@app/utils";
import { questionSetOne } from "@app/quiz-sets-contract";

export default function QuizStart() {
  const { darkMode } = useGameSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  return (
    <>
      <Button
        size="medium"
        href={getRoute("level", "one")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <QuizForm
        questions={questionSetOne}
        handleUnlock={handleUnlock}
        darkMode={darkMode}
      />
      <SkipButton onClick={handleUnlock} />
    </>
  );
}
