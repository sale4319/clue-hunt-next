"use client";
import { useState } from "react";
import { getRoute } from "@app/utils";
import { Button } from "clue-hunt-ui";

export default function LevelStart() {
  const [isLocked, setIsLocked] = useState(true);

  const handleState = () => {
    setIsLocked(!isLocked);
  };
  return (
    <>
      <Button size="medium" label="Unlock" mode="pulse" onClick={handleState} />
      <Button
        size="medium"
        href={`${getRoute(isLocked, "quiz", "start")}`}
        isLocked={isLocked}
        primary={isLocked}
      />
    </>
  );
}
