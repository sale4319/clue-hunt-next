import { NextRequest, NextResponse } from "next/server";
import { UserSettingsService } from "src/shared/lib/mongodb/services";

export async function POST(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { isLocked } = await request.json();

    if (typeof isLocked !== "boolean") {
      return NextResponse.json(
        { error: "isLocked must be a boolean" },
        { status: 400 }
      );
    }

    const userId = authCookie.value;
    await UserSettingsService.setLock(userId, isLocked);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting lock:", error);
    return NextResponse.json({ error: "Failed to set lock" }, { status: 500 });
  }
}
