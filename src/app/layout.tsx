import "server-only";
import type { Metadata } from "next";
import { MainHeader } from "@app/header-component";

import "./globals.css";
import styles from "./layout.module.css";

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
          <MainHeader /> {children}
        </div>
      </body>
    </html>
  );
}
