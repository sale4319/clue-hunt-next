import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear authentication cookie only
  // Keep theme cookie so user's preference persists across login/logout
  response.cookies.delete("clue_hunt_auth");

  return response;
}
