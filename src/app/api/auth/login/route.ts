import { NextRequest, NextResponse } from "next/server";

import { AuthService, UserSettingsService } from "@app/lib/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await AuthService.authenticateUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Ensure settings modal is closed on login
    const settings = await UserSettingsService.getSettings(username);
    if (settings.settingsOpen) {
      await UserSettingsService.toggleSettingsOpen(username);
    }

    // Create response with user data (excluding password)
    const response = NextResponse.json({
      success: true,
      user: {
        username: user.username,
        createdAt: user.createdAt,
      },
    });

    // Set authentication cookie
    response.cookies.set("clue_hunt_auth", username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Check if theme cookie already exists in the request
    const existingTheme = request.cookies.get(`clue_hunt_theme_${username}`);

    // If theme cookie doesn't exist, set it to dark as default
    // If it exists, don't override it (preserve user's preference)
    if (!existingTheme) {
      response.cookies.set(`clue_hunt_theme_${username}`, "dark", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    } else {
      // Re-set the existing theme cookie to ensure it's fresh
      response.cookies.set(`clue_hunt_theme_${username}`, existingTheme.value, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
