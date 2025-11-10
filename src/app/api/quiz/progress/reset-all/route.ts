import { NextRequest, NextResponse } from "next/server";

import { QuizProgressService } from "@app/lib/server";

export async function DELETE(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;

    await QuizProgressService.deleteAllProgress(userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error resetting all quiz progress:", error);
    return NextResponse.json(
      { error: "Failed to reset all quiz progress" },
      { status: 500 }
    );
  }
}
