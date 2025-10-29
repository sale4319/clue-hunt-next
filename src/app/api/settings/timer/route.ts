import { NextRequest, NextResponse } from "next/server";

import { UserSettingsService } from "@app/lib/server";

export async function POST(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { endDate } = await request.json();

    if (typeof endDate !== "number") {
      return NextResponse.json(
        { error: "endDate must be a number" },
        { status: 400 }
      );
    }

    const userId = authCookie.value;
    await UserSettingsService.setTimerEndDate(userId, endDate);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting timer:", error);
    return NextResponse.json({ error: "Failed to set timer" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    await UserSettingsService.clearTimerEndDate(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing timer:", error);
    return NextResponse.json(
      { error: "Failed to clear timer" },
      { status: 500 }
    );
  }
}
