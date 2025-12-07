"use client";

import { useState } from "react";
import { Button, QuestionIconToolTip, SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { CountdownTimer } from "@app/countdown-timer";
import { LevelCompleted } from "@app/level-completed";
import { statisticsApi } from "@app/lib/client";
import { LevelStartMessages, TooltipMessages } from "@app/messages-contract";
import { getRouteWithProgress, getRouteWithSkip } from "@app/utils";

export default function LevelStart() {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(true);
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();

  const savedDate = settings?.timerEndDate;
  const showStartButton =
    savedDate && savedDate !== null && savedDate !== undefined;

  const isCompleted = statistics?.completedLevelsMap?.start || false;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "start" : "one";
  const theme = settings?.theme || "dark";

  const completedLevelsCount = statistics?.completedLevelsMap
    ? Object.values(statistics.completedLevelsMap).filter((val) => val === true)
        .length
    : 0;

  const completedQuizzesCount = statistics?.correctlyCompletedQuizzes || 0;
  const isGameComplete =
    completedLevelsCount === 7 && completedQuizzesCount === 7;

  const shouldShowStartButton = showStartButton && !isGameComplete;

  const handleSetLock = async () => {
    setIsLocked(false);
    await refreshStatistics();
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRouteWithSkip(isQuizMode, isQuizRoute));
  };

  const handleCompleteLevel = async () => {
    await statisticsApi.setLevelCompleted("start", true);
    router.push(getRouteWithProgress(isQuizMode, isQuizRoute));
  };

  return (
    <>
      {isCompleted ? (
        <>
          <LevelCompleted handleContinue={handleCompleteLevel} />
        </>
      ) : (
        <>
          <Title
            titleSize="medium"
            label={LevelStartMessages.TITLE}
            theme={theme}
            align="center"
          />
          <Title
            titleSize="small"
            color={theme === "dark" ? "#75F8E2" : "#e91e63"}
            label={LevelStartMessages.INSTRUCTION}
            align="center"
          />
          <CountdownTimer />

          {isTimerStarted && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Title
                titleSize="medium"
                label={LevelStartMessages.HINT}
                theme={theme}
              />
              <QuestionIconToolTip
                size="large"
                onClick={handleSetLock}
                content={TooltipMessages.START_HINT}
              />
            </div>
          )}
          {shouldShowStartButton && (
            <Button
              size="medium"
              isLocked={isLocked}
              primary={isLocked}
              onClick={handleCompleteLevel}
            />
          )}
        </>
      )}
      {settings?.skipMode && (
        <SkipButton
          onClick={handleSkip}
          disabled={!isTimerStarted}
          theme={settings?.theme}
        />
      )}
    </>
  );
}
