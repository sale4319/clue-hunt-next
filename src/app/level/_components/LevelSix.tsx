"use client";

import { SkipButton, Title } from "clue-hunt-ui";
import { useRouter } from "next/navigation";

import { useSettings, useStatistics } from "@app/context/client";
import { useRefreshOnPageShow } from "@app/hooks";
import { LevelCompleted } from "@app/level-completed";
import { statisticsApi } from "@app/lib/client";
import {
  LevelSixMessages,
  QuestionFormMessages,
  TooltipMessages,
} from "@app/messages-contract";
import { QuestionForm } from "@app/question-form";
import { getRouteWithProgress, getRouteWithSkip } from "@app/utils";

import {
  completeAndNavigate,
  skipAndNavigate,
} from "../_utils/optimizedNavigation";

export default function LevelSix() {
  const router = useRouter();
  const { settings, isTimerStarted } = useSettings();
  const { statistics, refreshStatistics } = useStatistics();
  useRefreshOnPageShow(refreshStatistics);

  const isCompleted = statistics?.completedLevelsMap?.six || false;

  const handleUnlock = () => {
    const isQuizMode = settings?.quizMode ? "quiz" : "level";
    const isQuizRoute = settings?.quizMode ? "six" : "score";

    completeAndNavigate(
      "six",
      () => statisticsApi.setLevelCompleted("six", true),
      router.push,
      getRouteWithProgress(isQuizMode, isQuizRoute)
    );
  };

  const handleContinue = async () => {
    const isQuizMode = settings?.quizMode ? "quiz" : "level";
    const isQuizRoute = settings?.quizMode ? "six" : "score";
    router.push(getRouteWithProgress(isQuizMode, isQuizRoute));
  };

  const handleSkip = () => {
    const isQuizMode = settings?.quizMode ? "quiz" : "level";
    const isQuizRoute = settings?.quizMode ? "six" : "score";

    skipAndNavigate(
      () => statisticsApi.incrementSkipButtonClicks(),
      router.push,
      getRouteWithSkip(isQuizMode, isQuizRoute)
    );
  };

  return (
    <>
      {isCompleted ? (
        <LevelCompleted handleContinue={handleContinue} />
      ) : (
        <>
          <Title
            titleSize="small"
            label={LevelSixMessages.HINT}
            theme={settings?.theme}
            align="center"
          />

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
