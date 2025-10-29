import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "src/shared/lib/mongodb/services/AuthService";

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

    const user = await AuthService.createUser(username, password);

    if (!user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
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
    console.error("Registration error:", error);

    if (error instanceof Error && error.message === "Username already exists") {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
