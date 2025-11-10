"use client";

import { useEffect, useState } from "react";
import { Button, SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings } from "@app/context/client";
import { statisticsApi, type UserStatistics } from "@app/lib/client";
import { ScoreMessages } from "@app/messages-contract";
import { getRoute } from "@app/utils";

import styles from "./styles.module.css";

export default function LevelEnd() {
  const router = useRouter();
  const { settings } = useSettings();

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

  const handleSkip = async () => {
    router.push(getRoute("level", "start"));
  };

  if (isLoading) {
    return (
      <>
        <Title label="Loading statistics..." theme={settings?.theme} />
      </>
    );
  }

  const correctAnswers = (stats?.correctlyCompletedQuizzes || 0) * 6;

  const completedLevelsCount = stats?.completedLevelsMap
    ? Object.values(stats.completedLevelsMap).filter((val) => val === true)
        .length
    : 0;

  return (
    <>
      <Title label={ScoreMessages.TITLE} theme={settings?.theme} />
      <div
        className={[
          styles.scoreContainer,
          styles[settings?.theme || "dark"],
        ].join(" ")}
      >
        <Title
          label={`${ScoreMessages.QUIZES_SOLVED}${
            stats?.correctlyCompletedQuizzes || 0
          }/7`}
          titleSize="small"
          theme={settings?.theme}
        />
        <Title
          label={`${ScoreMessages.CORRECT_ANSWERS}${correctAnswers}/42`}
          titleSize="small"
          theme={settings?.theme}
        />
        <Title
          label={`${ScoreMessages.INCORRECT_ANSWERS}${
            stats?.incorrectAnswers || 0
          }`}
          titleSize="small"
          theme={settings?.theme}
        />
        <Title
          label={`${ScoreMessages.LEVELS_COMPLETED}${completedLevelsCount}/7`}
          titleSize="small"
          theme={settings?.theme}
        />
        <Title
          label={`${ScoreMessages.SKIPS_USED}${stats?.skipButtonClicks || 0}`}
          titleSize="small"
          theme={settings?.theme}
        />
      </div>
      <Button
        size="medium"
        href={getRoute("level", "start")}
        isLocked={false}
        primary={false}
        label="Restart"
      />
      {settings?.skipMode && <SkipButton onClick={handleSkip} />}
    </>
  );
}
