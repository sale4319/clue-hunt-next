"use client";
import { useState } from "react";
import { Button } from "clue-hunt-ui";
import { getRoute } from "@app/utils";

export default function LevelOne() {
  const [isLocked, setIsLocked] = useState(true);

  const handleState = () => {
    setIsLocked(!isLocked);
  };
  return (
    <>
      <Button size="medium" label="Unlock" mode="pulse" onClick={handleState} />
      <Button
        size="medium"
        href={`${getRoute(isLocked, "quiz", "one")}`}
        isLocked={isLocked}
        primary={isLocked}
      />
    </>
  );
}
