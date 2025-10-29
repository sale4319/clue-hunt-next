import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "src/shared/lib/mongodb/services/AuthService";

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await AuthService.getUserByUsername(authCookie.value);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Me endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
