"use client";

import { useState } from "react";
import { Button, QuestionForm, SkipButton, Title } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import {
  LevelSixMessages,
  QuestionFormMessages,
  TooltipMessages,
} from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelSix() {
  const { settings } = useSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "six" : "start";

  return (
    <>
      <Title
        titleSize="small"
        label={LevelSixMessages.HINT}
        theme={settings?.theme}
      />
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
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
