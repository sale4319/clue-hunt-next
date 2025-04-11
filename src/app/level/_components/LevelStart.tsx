"use client";

import { useState } from "react";
import { getRoute } from "@app/utils";
import { Button, QuestionIconToolTip, Title, SkipButton } from "clue-hunt-ui";
import { LevelStartMessages, TooltipMessages } from "@app/messages-contract";
import type { SettingsType } from "./types";
import { CountdownTimer } from "@app/countdown-timer";

export default function LevelStart({
  theme,
  quizMode,
  skipMode,
}: SettingsType) {
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "start" : "one";

  return (
    <>
      <Title
        titleSize="medium"
        label={LevelStartMessages.TITLE}
        theme={theme}
      />
      <Title
        titleSize="small"
        color="#75F8E2"
        label={LevelStartMessages.INSTRUCTION}
      />
      <CountdownTimer />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title
          titleSize="medium"
          label={LevelStartMessages.HINT}
          theme={theme}
        />
        <QuestionIconToolTip
          size="large"
          onClick={handleUnlock}
          content={TooltipMessages.START_HINT}
        />
      </div>
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
      />
      {skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
