"use client";

import "./DarkModeButton.css";
import { settingsApi } from "src/shared/lib/api/settings";
import { useSettings } from "@app/context";

export const DarkModeButton = () => {
  const { refreshSettings } = useSettings();

  const handleClick = async () => {
    await settingsApi.toggleTheme();
    await refreshSettings();
  };

  return <button id={"darkMode"} onClick={handleClick} />;
};
