"use client";

import "./DarkModeButton.css";
import { settingsApi } from "src/shared/lib/api/settings";
import { getClientSessionId } from "src/shared/lib/clientSession";
import { useSettings } from "@app/context";

export const DarkModeButton = () => {
  const { refreshSettings } = useSettings();

  const handleClick = async () => {
    const sessionId = getClientSessionId();
    await settingsApi.toggleTheme(sessionId);
    await refreshSettings();
  };

  return <button id={"darkMode"} onClick={handleClick} />;
};
