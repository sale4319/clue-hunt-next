"use client";

import { Button, SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { statisticsApi } from "@app/lib/client";
import {
  LevelSixMessages,
  QuestionFormMessages,
  TooltipMessages,
} from "@app/messages-contract";
import { QuestionForm } from "@app/question-form";
import { getRouteWithProgress, getRouteWithSkip } from "@app/utils";

import styles from "./styles.module.css";

export default function LevelSix() {
  const router = useRouter();
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();

  const isCompleted = statistics?.completedLevelsMap?.six || false;

  const handleUnlock = async () => {
    await statisticsApi.setLevelCompleted("six", true);
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

  const isQuizMode = settings?.quizMode ? "quiz" : "level";
  const isQuizRoute = settings?.quizMode ? "six" : "score";

  return (
    <>
      <Title
        titleSize="small"
        label={LevelSixMessages.HINT}
        theme={settings?.theme}
        align="center"
      />

      {isCompleted ? (
        <div
          className={[
            styles.contentBox,
            styles[settings?.theme || "dark"],
          ].join(" ")}
        >
          <Title
            label="Level completed! You can continue."
            titleSize="small"
            color="#75f8e2"
            align="center"
          />
          <Button
            size="medium"
            isLocked={false}
            primary={false}
            onClick={handleContinue}
            label="Continue"
          />
        </div>
      ) : (
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
          theme={settings?.theme}
        />
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
