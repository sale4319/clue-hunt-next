import { NextRequest, NextResponse } from "next/server";

import { UserStatisticsService } from "@app/lib/server";

export async function POST(request: NextRequest) {
  try {
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { quiz, completed } = await request.json();

    if (!quiz || typeof quiz !== "string") {
      return NextResponse.json(
        { error: "quiz must be a valid string" },
        { status: 400 }
      );
    }

    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "completed must be a boolean" },
        { status: 400 }
      );
    }

    const validQuizzes = [
      "start",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
    ];
    if (!validQuizzes.includes(quiz)) {
      return NextResponse.json({ error: "Invalid quiz name" }, { status: 400 });
    }

    const userId = authCookie.value;
    await UserStatisticsService.setQuizCompleted(
      userId,
      quiz as "start" | "one" | "two" | "three" | "four" | "five" | "six",
      completed
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting quiz completed:", error);
    return NextResponse.json(
      { error: "Failed to set quiz completed" },
      { status: 500 }
    );
  }
}
