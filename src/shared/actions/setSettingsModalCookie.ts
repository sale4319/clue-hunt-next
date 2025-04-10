"use server";
import { cookies } from "next/headers";

export async function setSettingsCookie() {
  const currentLockState = (await cookies()).get("settings")?.value === "true";
  const newLockState = !currentLockState;
  (await cookies()).set("settings", newLockState.toString());
}
