"use client";

import { useState } from "react";
import { Button, SkipButton } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { QuizForm } from "@app/quiz-form";
import { questionSetStart } from "@app/quiz-sets-contract";
import { getRoute } from "@app/utils";

export default function QuizStart() {
  const { settings } = useSettings();
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
        sessionId="quiz-start"
        questions={questionSetStart}
        handleUnlock={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
