import { NextRequest, NextResponse } from "next/server";
import { UserSettingsService } from "src/shared/lib/mongodb/services";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const settings = await UserSettingsService.getSettings(sessionId);

    // Convert to plain object to avoid serialization issues
    return NextResponse.json({
      sessionId: settings.sessionId,
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
