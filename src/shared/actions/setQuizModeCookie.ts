"use server";
import { cookies } from "next/headers";

export async function toggleQuizCookie() {
  const currentLockState = (await cookies()).get("quiz")?.value === "true";
  const newLockState = !currentLockState;
  (await cookies()).set("quiz", newLockState.toString());
}
