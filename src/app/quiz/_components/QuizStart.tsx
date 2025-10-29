"use client";

import { useState } from "react";
import { Button, QuizForm, SkipButton } from "clue-hunt-ui";
import { getRoute } from "@app/utils";
import { questionSetStart } from "@app/quiz-sets-contract";
import { useSettings } from "@app/context";

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
        questions={questionSetStart}
        handleUnlock={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
