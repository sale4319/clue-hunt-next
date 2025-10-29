import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "src/shared/lib/mongodb/services/AuthService";
import { UserSettingsService } from "src/shared/lib/mongodb/services/UserSettingsService";

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

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
