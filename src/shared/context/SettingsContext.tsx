"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";

import { settingsApi, type UserSettings } from "@app/lib/client";

type SettingsContextType = {
  settings: UserSettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  clearSettings: () => void;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
  refreshSettings: async () => {},
  clearSettings: () => {},
});

type SettingsProviderProps = {
  children: ReactNode;
  initialSettings?: UserSettings | null;
};

export function SettingsProvider({
  children,
  initialSettings,
}: SettingsProviderProps) {
  const [settings, setSettings] = useState<UserSettings | null>(
    initialSettings || null
  );
  const [isLoading, setIsLoading] = useState(!initialSettings);
  const pathname = usePathname();

  // Debug: Log initial settings to see if theme is included
  useEffect(() => {
    if (initialSettings) {
      console.log("SettingsProvider - Initial settings:", initialSettings);
      console.log(
        "SettingsProvider - Theme from initial:",
        initialSettings.theme
      );
    }
  }, [initialSettings]);

  const refreshSettings = async () => {
    setIsLoading(true);
    try {
      const userSettings = await settingsApi.getSettings();
      setSettings(userSettings);
      setIsLoading(false);
    } catch {
      setSettings(null);
      setIsLoading(false);
    }
  };

  const clearSettings = () => {
    setSettings(null);
    setIsLoading(true);
  };

  useEffect(() => {
    // If we have initial settings, don't fetch on mount
    if (initialSettings) {
      return;
    }

    // Only refresh settings when not on login page
    if (pathname !== "/login") {
      refreshSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, initialSettings]);

  return (
    <SettingsContext.Provider
      value={{ settings, isLoading, refreshSettings, clearSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// Client-side hook for accessing settings in client components
export function useSettings() {
  return useContext(SettingsContext);
}
