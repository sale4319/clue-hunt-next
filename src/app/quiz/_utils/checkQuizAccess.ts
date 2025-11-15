import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserStatisticsService } from "@app/lib/server";

type Quiz = "start" | "one" | "two" | "three" | "four" | "five" | "six";

/**
 * Server-side validation to check if user can access a quiz.
 * - Redirects to /login if not authenticated
 * - Redirects to /quiz/start if accessing locked quiz without skip=true or progress=true
 * - Allows access if: quiz is unlocked OR skip=true (skip button) OR progress=true (natural progression)
 */
export async function validateQuizAccess(
  quiz: Quiz,
  skip?: boolean,
  progress?: boolean
): Promise<string> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clue_hunt_auth");

  if (!authCookie?.value) {
    redirect("/login");
  }

  const userId = authCookie.value;

  // Allow if skip or progress is true (skip button or natural progression)
  if (skip || progress) {
    return userId;
  }

  // Otherwise, check if user has access to this quiz
  const hasAccess = await UserStatisticsService.isLevelAccessible(userId, quiz);

  if (!hasAccess) {
    redirect("/quiz/start");
  }

  return userId;
}
