"use client";

import { useState } from "react";
import { Button, QuestionForm, Title, SkipButton } from "clue-hunt-ui";
import { getRoute } from "@app/utils";
import {
  LevelFourMessages,
  QuestionFormMessages,
  TooltipMessages,
} from "@app/messages-contract";
import { useGameSettings } from "@app/context";

export default function LevelFour() {
  const { darkMode } = useGameSettings();
  const [isLocked, setIsLocked] = useState(true);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  return (
    <>
      <Title
        titleSize="small"
        label={LevelFourMessages.HINT}
        theme={darkMode}
      />
      <Button
        size="medium"
        href={getRoute("quiz", "four")}
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
        darkMode={darkMode}
      />
      <SkipButton onClick={handleUnlock} />
    </>
  );
}
