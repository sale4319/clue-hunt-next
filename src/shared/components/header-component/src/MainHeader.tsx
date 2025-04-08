"use client";

import { AppMenu } from "clue-hunt-ui";

import { useGameSettings } from "@app/context";

export const MainHeader = () => {
  const { darkMode, toggleDarkMode } = useGameSettings();
  return <AppMenu darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
};
