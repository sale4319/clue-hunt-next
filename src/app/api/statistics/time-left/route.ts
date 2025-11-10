import { NextRequest, NextResponse } from "next/server";

import { UserStatisticsService } from "@app/lib/server";

export async function POST(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { timeLeft } = await request.json();

    if (typeof timeLeft !== "number") {
      return NextResponse.json(
        { error: "timeLeft must be a number" },
        { status: 400 }
      );
    }

    const userId = authCookie.value;
    await UserStatisticsService.setTimeLeft(userId, timeLeft);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting time left:", error);
    return NextResponse.json(
      { error: "Failed to set time left" },
      { status: 500 }
    );
  }
}
