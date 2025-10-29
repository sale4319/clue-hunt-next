import { NextRequest, NextResponse } from "next/server";
import { UserSettingsService } from "src/shared/lib/mongodb/services";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    await UserSettingsService.toggleTheme(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling theme:", error);
    return NextResponse.json(
      { error: "Failed to toggle theme" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    await UserSettingsService.deleteTheme(sessionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting theme:", error);
    return NextResponse.json(
      { error: "Failed to delete theme" },
      { status: 500 }
    );
  }
}
