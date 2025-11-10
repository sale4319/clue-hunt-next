"use client";

import { useEffect, useState } from "react";
import { Button, SkipButton, Title } from "clue-hunt-ui";

import { useSettings } from "@app/context/client";
import { statisticsApi, type UserStatistics } from "@app/lib/client";
import { ScoreMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

export default function LevelEnd() {
  const { settings } = useSettings();
  const [isLocked, setIsLocked] = useState(true);
  const [stats, setStats] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statistics = await statisticsApi.getStatistics();
        setStats(statistics);
      } catch (error) {
        console.error("Failed to load statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
  };

  if (isLoading) {
    return (
      <>
        <Title label="Loading statistics..." theme={settings?.theme} />
      </>
    );
  }

  const correctAnswers = (stats?.correctlyCompletedQuizzes || 0) * 6;

  return (
    <>
      <Button
        size="medium"
        href={getRoute("level", "start")}
        isLocked={isLocked}
        primary={isLocked}
      />
      <Title
        label={`${stats?.correctlyCompletedQuizzes || 0}/6${
          ScoreMessages.QUIZES_SOLVED
        }`}
        theme={settings?.theme}
      />
      <Title
        label={`${correctAnswers}/36${ScoreMessages.CORRECT_ANSWERS}`}
        theme={settings?.theme}
      />
      <Title
        label={`${stats?.incorrectAnswers || 0}${
          ScoreMessages.INCORRECT_ANSWERS
        }`}
        theme={settings?.theme}
      />
      <Title
        label={`${stats?.completedLevels || 0}/6${
          ScoreMessages.LEVELS_COMPLETED
        }`}
        theme={settings?.theme}
      />
      <Title
        label={`${stats?.skipButtonClicks || 0}${ScoreMessages.SKIPS_USED}`}
        theme={settings?.theme}
      />
      {settings?.skipMode && <SkipButton onClick={handleUnlock} />}
    </>
  );
}
