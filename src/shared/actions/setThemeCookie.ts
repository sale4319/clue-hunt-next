"use server";
import { cookies } from "next/headers";

// Define a Server Action to allow us to set the cookie value
export async function setThemeCookie(formData: FormData) {
  // Get the new theme value from the form submission
  const theme = formData.get("theme") ?? "dark";
  // Set the cookie value
  (
    await // Set the cookie value
    cookies()
  ).set("theme", theme.toString());
}

export async function toggleThemeCookie() {
  const currentTheme = (await cookies()).get("theme")?.value || "dark";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  (await cookies()).set("theme", newTheme);
}

export async function deleteThemeCookie() {
  (await cookies()).delete("theme");
}
