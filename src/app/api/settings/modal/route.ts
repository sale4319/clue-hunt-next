import { NextRequest, NextResponse } from "next/server";
import { UserSettingsService } from "src/shared/lib/mongodb/services";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const newState = await UserSettingsService.toggleSettingsOpen(sessionId);

    return NextResponse.json({ settingsOpen: newState });
  } catch (error) {
    console.error("Error toggling settings modal:", error);
    return NextResponse.json(
      { error: "Failed to toggle settings modal" },
      { status: 500 }
    );
  }
}
