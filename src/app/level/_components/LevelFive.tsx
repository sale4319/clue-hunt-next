"use client";

import { Button, SkipButton, SpacerElement, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";
import { statisticsApi } from "src/shared/lib/src/api/statistics";

import { useSettings, useStatistics } from "@app/context/client";
import { LevelFiveMessages } from "@app/messages-contract";
import {
  getRouteWithProgress,
  getRouteWithSkip,
  useFeatureToggle,
} from "@app/utils";

export default function LevelFive() {
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();
  const router = useRouter();
  const isNewFeatureEnabled = useFeatureToggle("LEVEL_FIVE_UNLOCK");
  const isCompleted = statistics?.completedLevelsMap?.five || false;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "five" : "six";

  const handleUnlock = async () => {
    await statisticsApi.setLevelCompleted("five", true);
    await refreshStatistics();
    router.push(getRouteWithProgress(isQuizMode, isQuizRoute));
  };

  const handleContinue = async () => {
    router.push(getRouteWithProgress(isQuizMode, isQuizRoute));
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRouteWithSkip(isQuizMode, isQuizRoute));
  };

  return (
    <>
      <SpacerElement size="large" />
      <Title
        label={LevelFiveMessages.HINT}
        theme={settings?.theme}
        align="center"
      />
      {isCompleted ? (
        <Button
          size="medium"
          isLocked={false}
          primary={false}
          onClick={handleContinue}
          label="Continue"
        />
      ) : (
        isNewFeatureEnabled && (
          <Button
            size="medium"
            isLocked={false}
            primary={false}
            onClick={handleUnlock}
          />
        )
      )}
      {settings?.skipMode && (
        <SkipButton onClick={handleSkip} disabled={!isTimerStarted} />
      )}
    </>
  );
}
