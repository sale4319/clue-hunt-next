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
    await UserSettingsService.toggleSkipMode(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling skip mode:", error);
    return NextResponse.json(
      { error: "Failed to toggle skip mode" },
      { status: 500 }
    );
  }
}
