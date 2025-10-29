"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getClientSessionId } from "../lib/clientSession";
import { settingsApi, UserSettings } from "../lib/api/settings";

type SettingsContextType = {
  settings: UserSettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  isLoading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const sessionId = getClientSessionId();
      const userSettings = await settingsApi.getSettings(sessionId);
      setSettings(userSettings);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to refresh settings:", error);
    }
  };

  useEffect(() => {
    refreshSettings();

    // Poll for updates every second
    const interval = setInterval(refreshSettings, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
