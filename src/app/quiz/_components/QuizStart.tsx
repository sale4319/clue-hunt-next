"use client";
import { useState } from "react";
import { Button, QuizForm } from "clue-hunt-ui";
import { getRoute } from "@app/utils";
import { questionSetOne } from "@app/quiz-sets-contract";

export default function QuizStart() {
  const [isLocked, setIsLocked] = useState(true);

  const handleState = () => {
    setIsLocked(!isLocked);
  };
  return (
    <>
      <Button
        size="medium"
        {...(!isLocked && { href: `${getRoute("level", "one")}` })}
        isLocked={isLocked}
        primary={isLocked}
      />
      <QuizForm questions={questionSetOne} handleUnlock={handleState} />
    </>
  );
}
