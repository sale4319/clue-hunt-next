"use client";

import { Button, QuestionIconToolTip, SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { CountdownTimer } from "@app/countdown-timer";
import { statisticsApi } from "@app/lib/client";
import { LevelStartMessages, TooltipMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelStart() {
  const { settings } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();
  const router = useRouter();

  const savedDate = settings?.timerEndDate;
  const showStartButton =
    savedDate && savedDate !== null && savedDate !== undefined;

  const isCompleted = statistics?.completedLevelsMap?.start || false;
  const isLocked = !isCompleted && !statistics?.levelLocks?.start;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "start" : "one";

  const handleSetLock = async () => {
    await statisticsApi.setLevelLock("start", true);
    await refreshStatistics();
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  const handleCompleteLevel = async () => {
    await statisticsApi.setLevelCompleted("start", true);
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

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
          isLocked={isLocked}
          primary={isLocked}
          onClick={handleCompleteLevel}
        />
      )}
      {settings?.skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
