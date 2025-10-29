import { NextRequest, NextResponse } from "next/server";
import { UserSettingsService } from "src/shared/lib/mongodb/services";

export async function GET(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    const settings = await UserSettingsService.getSettings(userId);

    // Convert to plain object to avoid serialization issues
    return NextResponse.json({
      userId: settings.userId,
      theme: settings.theme,
      quizMode: settings.quizMode,
      skipMode: settings.skipMode,
      isLocked: settings.isLocked,
      settingsOpen: settings.settingsOpen,
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
