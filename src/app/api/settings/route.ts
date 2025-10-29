import { NextRequest, NextResponse } from "next/server";

import { UserSettingsService } from "@app/lib/server";

export async function GET(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    const settings = await UserSettingsService.getSettings(userId);

    // Get theme from cookie (primary source)
    const themeCookie = request.cookies.get(`clue_hunt_theme_${userId}`);
    const themeFromCookie =
      (themeCookie?.value as "light" | "dark") || settings.theme;

    // Convert to plain object to avoid serialization issues
    return NextResponse.json({
      userId: settings.userId,
      theme: themeFromCookie,
      quizMode: settings.quizMode,
      skipMode: settings.skipMode,
      isLocked: settings.isLocked,
      settingsOpen: settings.settingsOpen,
      timerEndDate: settings.timerEndDate,
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}
