import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear authentication cookie
  response.cookies.delete("clue_hunt_auth");

  return response;
}
