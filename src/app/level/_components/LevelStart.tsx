"use client";

import { Button, QuestionIconToolTip, SkipButton, Title } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { CountdownTimer } from "@app/countdown-timer";
import { LevelStartMessages, TooltipMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";
import { settingsApi, statisticsApi } from "@app/lib/client";

export default function LevelStart() {
  const { settings, refreshSettings } = useSettings();

  const savedDate = settings?.timerEndDate;
  const showStartButton =
    savedDate && savedDate !== null && savedDate !== undefined;

  const handleSetLock = async () => {
    await settingsApi.setLock(true);
    await refreshSettings();
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    await settingsApi.setLock(true);
    await refreshSettings();
  };

  const handleDeleteLock = async () => {
    await settingsApi.setLock(false);
    await refreshSettings();
  };

  const isLocked = !settings?.isLocked;
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
          onClick={handleSetLock}
          content={TooltipMessages.START_HINT}
        />
      </div>
      {showStartButton && (
        <Button
          size="medium"
          href={getRoute(isQuizMode, isQuizRoute)}
          isLocked={isLocked}
          primary={isLocked}
          onClick={handleDeleteLock}
        />
      )}
      {settings?.skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
