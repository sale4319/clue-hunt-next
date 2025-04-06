"use client";
import { useState } from "react";
import { Button, QuizForm } from "clue-hunt-ui";
import { getRoute, questionSetTwo } from "@app/utils";

export default function QuizOne() {
  const [isLocked, setIsLocked] = useState(true);

  const handleState = () => {
    setIsLocked(!isLocked);
  };
  return (
    <>
      <QuizForm questions={questionSetTwo} handleUnlock={handleState} />
      <Button
        size="medium"
        href={`${getRoute(isLocked, "level", "two")}`}
        isLocked={isLocked}
        primary={isLocked}
      />
    </>
  );
}
