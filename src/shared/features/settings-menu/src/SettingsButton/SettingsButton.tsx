"use client";

import { useState } from "react";
import { SettingsIcon } from "src/shared/assets/SettingsIcon";

import { useSettings } from "@app/context/client";

import { SettingsModal } from "../SettingsModal";

import styles from "./SettingsButton.module.css";

export function SettingsButton({}) {
  const { settings } = useSettings();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const theme = settings?.theme || "dark";

  const handleClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleCloseModal = () => {
    setSettingsOpen(false);
  };

  return (
    <>
      <button
        className={[styles.settingsButton, styles[theme]].join(" ")}
        onClick={handleClick}
        type="button"
      >
        <SettingsIcon />
      </button>
      <SettingsModal isOpen={settingsOpen} onClose={handleCloseModal} />
    </>
  );
}
