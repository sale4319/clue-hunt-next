import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AuthService,
  QuizProgressService,
  UserSettingsService,
} from "@app/lib/server";

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("clue_hunt_auth");

    if (!authCookie?.value) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // The auth cookie contains just the username string
    const username = authCookie.value;

    // Delete user settings and all quiz progress
    await UserSettingsService.deleteUserSettings(username);
    await QuizProgressService.deleteAllProgress(username);

    // Delete the user from database
    const deleted = await AuthService.deleteUser(username);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete user" },
        { status: 500 }
      );
    }

    // Clear all cookies
    cookieStore.delete("clue_hunt_auth");
    cookieStore.delete(`clue_hunt_theme_${username}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
