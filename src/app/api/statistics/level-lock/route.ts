import { NextRequest, NextResponse } from "next/server";

import { UserStatisticsService } from "@app/lib/server";

export async function POST(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { level, isLocked } = await request.json();

    if (!level || typeof level !== "string") {
      return NextResponse.json(
        { error: "level must be a valid string" },
        { status: 400 }
      );
    }

    if (typeof isLocked !== "boolean") {
      return NextResponse.json(
        { error: "isLocked must be a boolean" },
        { status: 400 }
      );
    }

    const validLevels = ["start", "one", "two", "three", "four", "five", "six"];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: "Invalid level name" },
        { status: 400 }
      );
    }

    const userId = authCookie.value;
    await UserStatisticsService.setLevelLock(
      userId,
      level as "start" | "one" | "two" | "three" | "four" | "five" | "six",
      isLocked
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting level lock:", error);
    return NextResponse.json(
      { error: "Failed to set level lock" },
      { status: 500 }
    );
  }
}
