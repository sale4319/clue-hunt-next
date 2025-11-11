import { NextRequest, NextResponse } from "next/server";

import { HighscoreService } from "@app/lib/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");

    console.log("Fetching highscores with limit:", limit);
    const highscores = await HighscoreService.getTopHighscores(limit);
    console.log("Retrieved highscores:", highscores.length, highscores);

    return NextResponse.json(highscores);
  } catch (error) {
    console.error("Error fetching highscores:", error);
    return NextResponse.json(
      { error: "Failed to fetch highscores" },
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

    const { score, completionTimeInSeconds, incorrectAnswers, skipsUsed } =
      body;

    // Validate required fields (allow score to be 0 but not undefined/null)
    if (score === undefined || score === null || !completionTimeInSeconds) {
      return NextResponse.json(
        { error: "Score and completion time are required" },
        { status: 400 }
      );
    }

    console.log("Saving highscore:", {
      userId,
      score,
      completionTimeInSeconds,
      incorrectAnswers: incorrectAnswers || 0,
      skipsUsed: skipsUsed || 0,
    });

    const highscore = await HighscoreService.saveHighscore({
      userId,
      score,
      completionTimeInSeconds,
      incorrectAnswers: incorrectAnswers || 0,
      skipsUsed: skipsUsed || 0,
    });

    return NextResponse.json(highscore);
  } catch (error) {
    console.error("Error saving highscore:", error);
    return NextResponse.json(
      { error: "Failed to save highscore" },
      { status: 500 }
    );
  }
}
