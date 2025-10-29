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
    const newTheme = await UserSettingsService.toggleTheme(userId);

    const response = NextResponse.json({ success: true, theme: newTheme });

    // Set theme cookie for server-side rendering
    response.cookies.set(`clue_hunt_theme_${userId}`, newTheme, {
      httpOnly: false, // Allow client-side access for immediate theme switching
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return response;
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
    // Get userId from auth cookie
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = authCookie.value;
    await UserSettingsService.deleteTheme(userId);

    const response = NextResponse.json({ success: true });

    // Set theme cookie to default (dark)
    response.cookies.set(`clue_hunt_theme_${userId}`, "dark", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error deleting theme:", error);
    return NextResponse.json(
      { error: "Failed to delete theme" },
      { status: 500 }
    );
  }
}
