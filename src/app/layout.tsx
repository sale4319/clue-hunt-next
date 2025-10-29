import "server-only";

import type { Metadata } from "next";
import { Audiowide } from "next/font/google";
import { cookies } from "next/headers";

import { AuthProvider, SettingsProvider } from "@app/context/client";
import { getServerSettings } from "@app/context/server";

import "./globals.css";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Clue hunt",
  description: "Experimental game with next.js",
};

export const fontFamily = Audiowide({
  weight: ["400"],
  preload: true,
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get theme from user-specific cookie
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("clue_hunt_auth");
  const userId = authCookie?.value;
  const themeCookie = userId
    ? cookieStore.get(`clue_hunt_theme_${userId}`)
    : null;
  const theme = (themeCookie?.value as "light" | "dark") || "dark";

  // Get initial settings from server (includes theme from cookie)
  const initialSettings = await getServerSettings();

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>

      <SettingsProvider initialSettings={initialSettings}>
        <AuthProvider>
          <body className={`${fontFamily.className} ${theme} antialiased`}>
            <div className={styles.container}>{children}</div>
          </body>
        </AuthProvider>
      </SettingsProvider>
    </html>
  );
}
