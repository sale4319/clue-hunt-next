"use client";

import { useState } from "react";
import { Button, QuizForm, SkipButton } from "clue-hunt-ui";

import { getRoute } from "@app/utils";
import { questionSetThree } from "@app/quiz-sets-contract";
import { SettingsType } from "./types";

export default function QuizThree({ theme, skipMode }: SettingsType) {
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
        questions={questionSetThree}
        handleUnlock={handleUnlock}
        theme={theme}
      />
      {skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
