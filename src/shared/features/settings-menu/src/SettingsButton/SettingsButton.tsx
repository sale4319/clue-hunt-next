"use client";

import { useState } from "react";
import { SettingsModal } from "../SettingsModal";

type SettingsButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function SettingsButton({ className, children }: SettingsButtonProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleClick = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleCloseModal = () => {
    setSettingsOpen(false);
  };

  return (
    <>
      <button className={className} onClick={handleClick} type="button">
        {children}
      </button>
      <SettingsModal isOpen={settingsOpen} onClose={handleCloseModal} />
    </>
  );
}
