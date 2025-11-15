"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { UserSettingsService } from "@app/lib/server";

export async function toggleTheme() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clue_hunt_auth");
  const userId = authCookie?.value;

  if (!userId) {
    return;
  }

  const themeCookieName = `clue_hunt_theme_${userId}`;
  const currentTheme = cookieStore.get(themeCookieName)?.value || "dark";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  cookieStore.set(themeCookieName, newTheme, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  try {
    await UserSettingsService.toggleTheme(userId);
  } catch (error) {
    console.error("Failed to sync theme to database:", error);
  }

  revalidatePath("/", "layout");
}
