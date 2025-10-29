import "server-only";

import type { Metadata } from "next";
import { Audiowide } from "next/font/google";

import { SettingsProvider, AuthProvider } from "@app/context";

import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clue hunt",
  description: "Experimental game with next.js",
};

export const fontFamily = Audiowide({
  weight: ["400"],
  preload: true,
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>

      <SettingsProvider>
        <AuthProvider>
          <body className={`${fontFamily.className} antialiased`}>
            <div className={styles.container}>{children}</div>
          </body>
        </AuthProvider>
      </SettingsProvider>
    </html>
  );
}
