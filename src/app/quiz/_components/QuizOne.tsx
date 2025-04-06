"use client";
import { useState } from "react";
import { Button, QuizForm } from "clue-hunt-ui";
import { getRoute } from "@app/utils";
import { questionSetTwo } from "@app/constants";

export default function QuizOne() {
  const [isLocked, setIsLocked] = useState(true);

  const handleState = () => {
    setIsLocked(!isLocked);
  };
  return (
    <>
      <Button
        size="medium"
        {...(!isLocked && { href: `${getRoute("level", "two")}` })}
        isLocked={isLocked}
        primary={isLocked}
      />
      <QuizForm questions={questionSetTwo} handleUnlock={handleState} />
    </>
  );
}
