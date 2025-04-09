"use server";
import { cookies } from "next/headers";

export async function toggleLockCookie() {
  const currentLockState = (await cookies()).get("lock")?.value === "true";
  const newLockState = !currentLockState;
  (await cookies()).set("lock", newLockState.toString());
}

export async function deleteLockCookie() {
  (await cookies()).delete("lock");
}
