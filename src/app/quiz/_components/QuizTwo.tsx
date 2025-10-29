"use client";

import { useState } from "react";
import { Button, QuizForm, SkipButton } from "clue-hunt-ui";

import { useSettings } from "@app/context";
import { questionSetTwo } from "@app/quiz-sets-contract";
import { getRoute } from "@app/utils";

export default function QuizTwo() {
  const { settings } = useSettings();
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
        questions={questionSetTwo}
        handleUnlock={handleUnlock}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
