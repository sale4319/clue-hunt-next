import { NextRequest, NextResponse } from "next/server";

import { AuthService } from "@app/lib/server";

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

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: "Username must be between 3 and 50 characters" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const result = await AuthService.createUser(username, password);

    if (!result.success) {
      if (result.error === "USERNAME_EXISTS") {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create response with user data (excluding password)
    const response = NextResponse.json({
      success: true,
      user: {
        username: result.user.username,
        createdAt: result.user.createdAt,
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

    // Set theme cookie to default (dark) for new users
    response.cookies.set(`clue_hunt_theme_${username}`, "dark", {
      httpOnly: false, // Allow client-side access
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Unexpected registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
