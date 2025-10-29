"use client";

import { useState } from "react";
import { Button, QuestionIconToolTip, SkipButton, Title } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { CountdownTimer } from "@app/countdown-timer";
import { LevelStartMessages, TooltipMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelStart() {
  const { settings } = useSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "start" : "one";

  return (
    <>
      <Title
        titleSize="medium"
        label={LevelStartMessages.TITLE}
        theme={settings?.theme}
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
          theme={settings?.theme}
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
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
