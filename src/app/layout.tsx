import "server-only";

import type { Metadata } from "next";

import { GameSettingsProvider } from "@app/context";

import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clue hunt",
  description: "Experimental game with next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/clue-hunt-next/favicon.svg"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Audiowide&display=optional"
        />
      </head>
      <GameSettingsProvider>
        <body>
          <div className={styles.container}>{children}</div>
        </body>
      </GameSettingsProvider>
    </html>
  );
}
