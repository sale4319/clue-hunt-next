"use client";

import { useState } from "react";
import { Button, QuestionForm, Title, SkipButton } from "clue-hunt-ui";
import { getRoute } from "@app/utils";

import {
  LevelSixMessages,
  QuestionFormMessages,
  TooltipMessages,
} from "@app/messages-contract";
import { SettingsType } from "./types";

export default function LevelSix({ theme, quizMode, skipMode }: SettingsType) {
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "six" : "start";

  return (
    <>
      <Title titleSize="small" label={LevelSixMessages.HINT} theme={theme} />
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
      />
      <QuestionForm
        questionIconSize="small"
        handleUnlock={handleUnlock}
        successMessage={QuestionFormMessages.WOW}
        firstQuestion={QuestionFormMessages.FIRST_Q_LABEL}
        firstHint={TooltipMessages.FIRST_Q_HINT}
        firstPlaceholder={QuestionFormMessages.FIRST_Q_PLACEHOLDER}
        secondQuestion={QuestionFormMessages.SECOND_Q_LABEL}
        secondHint={TooltipMessages.SECOND_Q_HINT}
        secondPlaceholder={QuestionFormMessages.SECOND_Q_PLACEHOLDER}
        theme={theme}
      />
      {skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
