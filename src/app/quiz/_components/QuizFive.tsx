"use client";

import { useState } from "react";
import { Button, SkipButton } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { QuizForm } from "@app/quiz-form";
import { questionSetFive } from "@app/quiz-sets-contract";
import { getRoute } from "@app/utils";

export default function QuizFive() {
  const { settings } = useSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  return (
    <>
      <Button
        size="medium"
        href={getRoute("level", "six")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <QuizForm
        sessionId="quiz-5"
        questions={questionSetFive}
        handleUnlock={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
