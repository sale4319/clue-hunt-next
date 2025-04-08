"use client";

import { Container } from "clue-hunt-ui";

import { useGameSettings } from "@app/context";

type ContentWrapperProps = {
  children: React.ReactNode;
};

export const ContentWrapper = ({ children }: ContentWrapperProps) => {
  const { darkMode } = useGameSettings();
  return <Container darkMode={darkMode}>{children}</Container>;
};
