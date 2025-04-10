import "server-only";

import type { Metadata } from "next";
import { MainHeader } from "@app/header-component";
import { GameSettingsProvider } from "@app/context";
import { cookies } from "next/headers";

import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clue hunt",
  description: "Experimental game with next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = (await cookies()).get("theme");
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
          <div className={styles.container}>
            <MainHeader theme={theme?.value} />
            {children}
          </div>
        </body>
      </GameSettingsProvider>
    </html>
  );
}
