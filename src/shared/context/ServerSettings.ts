import "server-only";

import { cookies } from "next/headers";

import { type UserSettings, UserSettingsService } from "@app/lib/server";

/**
 * Server-side function to get user settings with theme from cookie
 * Use this in server components, server actions, and API routes
 */
export async function getServerSettings(): Promise<UserSettings | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clue_hunt_auth");
  const userId = authCookie?.value;

  if (!userId) {
    return null;
  }

  try {
    const settings = await UserSettingsService.getSettings(userId);

    // Get theme from cookie (primary source)
    const themeCookie = cookieStore.get(`clue_hunt_theme_${userId}`);
    const themeFromCookie = (themeCookie?.value as "light" | "dark") || "dark";

    // Convert to UserSettings format (dates as strings)
    return {
      userId: settings.userId,
      theme: themeFromCookie,
      quizMode: settings.quizMode,
      skipMode: settings.skipMode,
      timerEndDate: settings.timerEndDate,
      isAdmin: settings.isAdmin,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching server settings:", error);
    return null;
  }
}
/**
 * Server-side function to get current user ID
 * Use this in server components, server actions, and API routes
 */
export async function getServerUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clue_hunt_auth");
  return authCookie?.value || null;
}
