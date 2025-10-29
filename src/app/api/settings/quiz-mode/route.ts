import { NextRequest, NextResponse } from "next/server";

import { UserSettingsService } from "@app/lib/server";

export async function POST(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    await UserSettingsService.toggleQuizMode(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling quiz mode:", error);
    return NextResponse.json(
      { error: "Failed to toggle quiz mode" },
      { status: 500 }
    );
  }
}
