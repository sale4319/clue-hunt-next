import { NextRequest, NextResponse } from "next/server";
import { UserSettingsService } from "src/shared/lib/mongodb/services";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, isLocked } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    if (typeof isLocked !== "boolean") {
      return NextResponse.json(
        { error: "isLocked must be a boolean" },
        { status: 400 }
      );
    }

    await UserSettingsService.setLock(sessionId, isLocked);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting lock:", error);
    return NextResponse.json({ error: "Failed to set lock" }, { status: 500 });
  }
}
