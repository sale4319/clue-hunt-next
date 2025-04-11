"use client";

import { Button, Title, SkipButton, SpacerElement } from "clue-hunt-ui";
import { getRoute, useFeatureToggle } from "@app/utils";

import { LevelFiveMessages } from "@app/messages-contract";
import { SettingsType } from "./types";
import { useRouter, useSearchParams } from "next/navigation";

export default function LevelFive({ theme, quizMode, skipMode }: SettingsType) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNewFeatureEnabled = useFeatureToggle("LEVEL_FIVE_UNLOCK");

  const handleUnlock = () => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("LEVEL_FIVE_UNLOCK", "true");

    router.push(`?${params.toString()}`);
  };

  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "five" : "six";

  return (
    <>
      <SpacerElement size="large" />
      <Title label={LevelFiveMessages.HINT} theme={theme} />
      {isNewFeatureEnabled && (
        <Button
          size="medium"
          href={getRoute(isQuizMode, isQuizRoute)}
          isLocked={false}
          primary={false}
        />
      )}
      {skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
