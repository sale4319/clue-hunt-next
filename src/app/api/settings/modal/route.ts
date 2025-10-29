import { NextRequest, NextResponse } from "next/server";
import { UserSettingsService } from "src/shared/lib/mongodb/services";

export async function POST(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    const newState = await UserSettingsService.toggleSettingsOpen(userId);

    return NextResponse.json({ settingsOpen: newState });
  } catch (error) {
    console.error("Error toggling settings modal:", error);
    return NextResponse.json(
      { error: "Failed to toggle settings modal" },
      { status: 500 }
    );
  }
}
