import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserStatisticsService } from "@app/lib/server";

type Level = "start" | "one" | "two" | "three" | "four" | "five" | "six";

/**
 * Server-side validation to check if user can access a level
 * Redirects to /level/start if access is denied
 */
export async function validateLevelAccess(level: Level): Promise<string> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clue_hunt_auth");

  if (!authCookie?.value) {
    redirect("/login");
  }

  const userId = authCookie.value;

  const hasAccess = await UserStatisticsService.isLevelAccessible(
    userId,
    level
  );

  if (!hasAccess) {
    redirect("/level/start");
  }

  return userId;
}
