"use client";

import { Button, SkipButton, SpacerElement, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";
import { statisticsApi } from "src/shared/lib/src/api/statistics";

import { useSettings, useStatistics } from "@app/context/client";
import { LevelFiveMessages } from "@app/messages-contract";
import { getRoute, useFeatureToggle } from "@app/utils";

export default function LevelFive() {
  const { settings } = useSettings();
  const { refreshStatistics } = useStatistics();
  const router = useRouter();
  const isNewFeatureEnabled = useFeatureToggle("LEVEL_FIVE_UNLOCK");
  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "five" : "six";

  const handleUnlock = async () => {
    await statisticsApi.setLevelCompleted("five", true);
    await refreshStatistics();
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  const handleSkip = async () => {
    await statisticsApi.incrementSkipButtonClicks();
    router.push(getRoute(isQuizMode, isQuizRoute));
  };

  return (
    <>
      <SpacerElement size="large" />
      <Title label={LevelFiveMessages.HINT} theme={settings?.theme} />
      {isNewFeatureEnabled && (
        <Button
          size="medium"
          isLocked={false}
          primary={false}
          onClick={handleUnlock}
        />
      )}
      {settings?.skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
