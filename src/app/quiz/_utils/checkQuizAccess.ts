import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserStatisticsService } from "@app/lib/server";

type Quiz = "start" | "one" | "two" | "three" | "four" | "five" | "six";

/**
 * Server-side validation to check if user can access a quiz
 * Redirects to /quiz/start if access is denied
 */
export async function validateQuizAccess(quiz: Quiz): Promise<string> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clue_hunt_auth");

  if (!authCookie?.value) {
    redirect("/login");
  }

  const userId = authCookie.value;

  const hasAccess = await UserStatisticsService.isLevelAccessible(userId, quiz);

  if (!hasAccess) {
    // User tried to skip ahead, redirect to start
    redirect("/quiz/start");
  }

  return userId;
}
