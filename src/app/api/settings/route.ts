import { NextRequest, NextResponse } from "next/server";

import {
  AuthService,
  UserSettingsService,
  UserStatisticsService,
} from "@app/lib/server";

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
      settingsOpen: settings.settingsOpen,
      timerEndDate: settings.timerEndDate,
      isAdmin: settings.isAdmin || false,
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

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    const body = await request.json();

    if (body.action === "restart") {
      // Verify user is admin by checking User document
      const user = await AuthService.getUserByUsername(userId);
      if (!user || !user.isAdmin) {
        return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 403 }
        );
      }

      // Reset all statistics
      await UserStatisticsService.resetStatistics(userId);

      return NextResponse.json({
        success: true,
        message: "Game statistics reset successfully",
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in settings POST:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
