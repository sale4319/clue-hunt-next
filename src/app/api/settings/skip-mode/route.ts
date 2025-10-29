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

    await UserSettingsService.toggleSkipMode(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling skip mode:", error);
    return NextResponse.json(
      { error: "Failed to toggle skip mode" },
      { status: 500 }
    );
  }
}
