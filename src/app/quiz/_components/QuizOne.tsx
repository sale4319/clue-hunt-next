"use client";
import { useState } from "react";
import { Button, QuizForm, SkipButton } from "clue-hunt-ui";
import { getRoute } from "@app/utils";
import { questionSetTwo } from "@app/quiz-sets-contract";

export default function QuizOne() {
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  return (
    <>
      <Button
        size="medium"
        href={getRoute("level", "two")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <QuizForm questions={questionSetTwo} handleUnlock={handleUnlock} />
      <SkipButton onClick={handleUnlock} />
    </>
  );
}
