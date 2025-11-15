"use client";

import { useRouter } from "next/navigation";

import { useSettings } from "@app/context/client";

import { toggleTheme } from "../../../actions/toggleTheme";

import styles from "./DarkModeButton.module.css";

export const DarkModeButton = () => {
  const router = useRouter();
  const { refreshSettings, settings } = useSettings();
  const theme = settings?.theme || "dark";

  const handleToggle = async () => {
    await toggleTheme();
    await refreshSettings();
    router.refresh();
  };

  return (
    <button
      className={[styles.darkMode, styles[theme]].join(" ")}
      onClick={handleToggle}
    />
  );
};
