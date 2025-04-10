import { cookies } from "next/headers";

export async function getLockCookie() {
  "use server";
  (await cookies()).set("lock", "true");
}

export async function deleteLockCookie() {
  "use server";
  (await cookies()).delete("lock");
}
