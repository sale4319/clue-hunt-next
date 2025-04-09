"use server";
import { cookies } from "next/headers";

export async function toggleSkipCookie() {
  const currentLockState = (await cookies()).get("skip")?.value === "true";
  const newLockState = !currentLockState;
  (await cookies()).set("skip", newLockState.toString());
}
