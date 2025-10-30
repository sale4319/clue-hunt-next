import { NextRequest, NextResponse } from "next/server";

import { QuizProgressService } from "@app/lib/server";

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const progress = await QuizProgressService.getProgress(userId, sessionId);

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching quiz progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz progress" },
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
    const { sessionId, ...updateData } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const progress = await QuizProgressService.updateProgress(
      userId,
      sessionId,
      updateData
    );

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating quiz progress:", error);
    return NextResponse.json(
      { error: "Failed to update quiz progress" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const progress = await QuizProgressService.resetProgress(userId, sessionId);

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error resetting quiz progress:", error);
    return NextResponse.json(
      { error: "Failed to reset quiz progress" },
      { status: 500 }
    );
  }
}
