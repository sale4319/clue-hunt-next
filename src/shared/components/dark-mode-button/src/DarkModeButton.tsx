"use client";

import { useRouter } from "next/navigation";

import { useSettings } from "@app/context/client";

import { toggleTheme } from "../../../actions/toggleTheme";

import "./DarkModeButton.css";

export const DarkModeButton = () => {
  const router = useRouter();
  const { refreshSettings } = useSettings();

  const handleToggle = async () => {
    await toggleTheme();
    await refreshSettings();
    router.refresh();
  };

  return <button id={"darkMode"} onClick={handleToggle} />;
};
