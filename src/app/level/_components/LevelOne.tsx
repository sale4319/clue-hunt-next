import "server-only";

import {
  Button,
  SpacerElement,
  UnlockButton,
  Title,
  SkipButton,
} from "clue-hunt-ui";
import { getRoute } from "@app/utils";

import { LevelOneMessages } from "@app/messages-contract";
import { cookies } from "next/headers";
import { deleteLockCookie, setLockCookie } from "@app/actions";

export default async function LevelOne() {
  const theme = (await cookies()).get("theme");
  const isLocked = (await cookies()).get("lock")?.value === undefined;
  const quizMode = (await cookies()).get("quiz")?.value === "true";
  const skipMode = (await cookies()).get("skip")?.value === "true";
  const isQuizMode = quizMode ? "quiz" : "level";
  const isQuizRoute = quizMode ? "one" : "two";

  return (
    <>
      <SpacerElement size="medium">
        <UnlockButton
          data-testid="unlockButton"
          onClick={setLockCookie}
          label={LevelOneMessages.UNLOCK}
        />
      </SpacerElement>
      <Title label={LevelOneMessages.HINT} theme={theme?.value} />
      <Button
        size="medium"
        href={getRoute(isQuizMode, isQuizRoute)}
        isLocked={isLocked}
        primary={isLocked}
        onClick={deleteLockCookie}
      />
      {skipMode && <SkipButton onClick={setLockCookie} />}
    </>
  );
}
