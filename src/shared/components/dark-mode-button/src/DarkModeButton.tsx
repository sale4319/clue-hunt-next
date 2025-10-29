"use client";

import { settingsApi } from "src/shared/lib/api/settings";

import { useSettings } from "@app/context";

import "./DarkModeButton.css";

export const DarkModeButton = () => {
  const { refreshSettings } = useSettings();

  const handleClick = async () => {
    await settingsApi.toggleTheme();
    await refreshSettings();
  };

  return <button id={"darkMode"} onClick={handleClick} />;
};
