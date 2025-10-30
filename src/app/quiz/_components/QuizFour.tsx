"use client";

import { useState } from "react";
import { Button, SkipButton } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { QuizForm } from "@app/quiz-form";
import { questionSetFour } from "@app/quiz-sets-contract";
import { getRoute } from "@app/utils";

export default function QuizFour() {
  const { settings } = useSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  return (
    <>
      <Button
        size="medium"
        href={getRoute("level", "five")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <QuizForm
        sessionId="quiz-4"
        questions={questionSetFour}
        handleUnlock={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
