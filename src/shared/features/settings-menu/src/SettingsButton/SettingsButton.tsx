"use client";

import { getClientSessionId } from "src/shared/lib/clientSession";
import { settingsApi } from "src/shared/lib/api/settings";
import { useSettings } from "@app/context";

type SettingsButtonProps = {
  className?: string;
  children: React.ReactNode;
};

export function SettingsButton({ className, children }: SettingsButtonProps) {
  const { refreshSettings } = useSettings();

  const handleClick = async () => {
    const sessionId = getClientSessionId();
    await settingsApi.toggleSettingsModal(sessionId);
    await refreshSettings();
  };

  return (
    <button className={className} onClick={handleClick} type="button">
      {children}
    </button>
  );
}
