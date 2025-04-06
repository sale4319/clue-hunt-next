import { MainHeader } from "@app/header-component";
import type { Metadata } from "next";

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
      </head>
      <body>
        <>
          <MainHeader /> {children}
        </>
      </body>
    </html>
  );
}
