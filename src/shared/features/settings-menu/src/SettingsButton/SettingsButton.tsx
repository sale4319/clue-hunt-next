"use client";

import { useSettings } from "@app/context/client";
import { settingsApi } from "@app/lib/client";

type SettingsButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function SettingsButton({ className, children }: SettingsButtonProps) {
  const { refreshSettings } = useSettings();

  const handleClick = async () => {
    await settingsApi.toggleSettingsModal();
    await refreshSettings();
  };

  return (
    <button className={className} onClick={handleClick} type="button">
      {children}
    </button>
  );
}
