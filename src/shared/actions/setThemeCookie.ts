import { cookies } from "next/headers";

export async function toggleThemeCookie() {
  "use server";
  const currentTheme = (await cookies()).get("theme")?.value || "dark";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  (await cookies()).set("theme", newTheme);
}

export async function deleteThemeCookie() {
  "use server";
  (await cookies()).delete("theme");
}
