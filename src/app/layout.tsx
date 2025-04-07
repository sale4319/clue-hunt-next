import "server-only";
import type { Metadata } from "next";
import { AppMenu } from "clue-hunt-ui";

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
        <link rel="icon" href="/favicon.svg" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Audiowide"
        />
      </head>
      <body>
        <div className={styles.container}>
          <AppMenu />
          {children}
        </div>
      </body>
    </html>
  );
}
