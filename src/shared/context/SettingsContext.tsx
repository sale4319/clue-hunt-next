"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { settingsApi, UserSettings } from "../lib/api/settings";

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

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const userSettings = await settingsApi.getSettings();
      setSettings(userSettings);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  const clearSettings = () => {
    setSettings(null);
    setIsLoading(true);
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, isLoading, refreshSettings, clearSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
