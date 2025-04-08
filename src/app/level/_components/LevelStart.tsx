"use client";

import { useState } from "react";
import { getRoute } from "@app/utils";
import { Button, QuestionIconToolTip, Title, SkipButton } from "clue-hunt-ui";
import { useGameSettings } from "@app/context";
import { LevelStartMessages, TooltipMessages } from "@app/messages-contract";

export default function LevelStart() {
  const { darkMode, skipMode, quizMode } = useGameSettings();
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
        theme={darkMode}
      />
      <Title
        titleSize="small"
        color="#75F8E2"
        label={LevelStartMessages.INSTRUCTION}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title
          titleSize="medium"
          label={LevelStartMessages.HINT}
          theme={darkMode}
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
