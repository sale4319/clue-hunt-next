import { NextRequest, NextResponse } from "next/server";

import { UserStatisticsService } from "@app/lib/server";

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    const stats = await UserStatisticsService.getStatistics(userId);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    const body = await request.json();
    const { action, count, timerEndDate } = body;

    let stats;

    switch (action) {
      case "incrementIncorrectAnswers":
        stats = await UserStatisticsService.incrementIncorrectAnswers(
          userId,
          count || 1
        );
        break;
      case "incrementSkip":
        stats = await UserStatisticsService.incrementSkipButtonClicks(userId);
        break;
      case "reset":
        stats = await UserStatisticsService.resetStatistics(userId);
        break;
      case "markGameCompleted":
        console.log(
          "API: Marking game as completed for user:",
          userId,
          "with timerEndDate:",
          timerEndDate
        );
        stats = await UserStatisticsService.markGameCompleted(
          userId,
          timerEndDate
        );
        console.log("API: Game marked as completed, result:", stats);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error updating user statistics:", error);
    return NextResponse.json(
      { error: "Failed to update user statistics" },
      { status: 500 }
    );
  }
}
