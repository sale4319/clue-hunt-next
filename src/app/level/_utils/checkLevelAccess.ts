import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserStatisticsService } from "@app/lib/server";

type Level = "start" | "one" | "two" | "three" | "four" | "five" | "six";

/**
 * Server-side validation to check if user can access a level.
 * - Redirects to /login if not authenticated
 * - Redirects to /level/start if accessing locked level without skip=true or progress=true
 * - Allows access if: level is unlocked OR skip=true (skip button) OR progress=true (natural progression)
 */
export async function validateLevelAccess(
  level: Level,
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

  // Otherwise, check if user has access to this level
  const hasAccess = await UserStatisticsService.isLevelAccessible(
    userId,
    level
  );

  if (!hasAccess) {
    redirect("/level/start");
  }

  return userId;
}
