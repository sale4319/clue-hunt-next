"use client";

import { Button, SkipButton, SpacerElement, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";
import { statisticsApi } from "src/shared/lib/src/api/statistics";

import { useSettings, useStatistics } from "@app/context/client";
import { useRefreshOnPageShow } from "@app/hooks";
import { LevelCompleted } from "@app/level-completed";
import { LevelFiveMessages } from "@app/messages-contract";
import {
  getRouteWithProgress,
  getRouteWithSkip,
  useFeatureToggle,
} from "@app/utils";

export default function LevelFive() {
  const router = useRouter();
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();
  useRefreshOnPageShow(refreshStatistics);

  const isNewFeatureEnabled = useFeatureToggle("LEVEL_FIVE_UNLOCK");
  const isCompleted = statistics?.completedLevelsMap?.five || false;
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "five" : "six";

  const handleUnlock = async () => {
    await statisticsApi.setLevelCompleted("five", true);
    router.push(getRouteWithProgress(isQuizMode, isQuizRoute));
    await refreshStatistics();
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
      {isCompleted ? (
        <LevelCompleted handleContinue={handleContinue} />
      ) : (
        <>
          <SpacerElement size="large" />
          <Title
            label={LevelFiveMessages.HINT}
            theme={settings?.theme}
            align="center"
          />

          {isNewFeatureEnabled && (
            <Button
              size="medium"
              isLocked={false}
              primary={false}
              onClick={handleUnlock}
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
