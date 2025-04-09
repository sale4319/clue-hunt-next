"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { useLocalStorage } from "../utils/useLocalStorage";

type GameSettingsType = {
  quizMode: boolean;
  darkMode: boolean;
  skipMode: boolean;
  setDarkMode: (value: boolean) => void;
  setQuizMode: (value: boolean) => void;
  setSkipMode: (value: boolean) => void;
  toggleQuizMode: () => void;
  toggleDarkMode: () => void;
  toggleSkipMode: () => void;
};
const defaultValues: GameSettingsType = {
  quizMode: true,
  darkMode: true,
  skipMode: true,
  setDarkMode: () => {},
  setQuizMode: () => {},
  setSkipMode: () => {},
  toggleQuizMode: () => {},
  toggleDarkMode: () => {},
  toggleSkipMode: () => {},
};

const GameSettingsContext = createContext<GameSettingsType>(defaultValues);

export const GameSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [quizMode, setQuizMode] = useLocalStorage("quizMode", true);
  const [darkMode, setDarkMode] = useState(true);
  const [skipMode, setSkipMode] = useLocalStorage("skipMode", true);

  const toggleQuizMode = () => {
    setQuizMode(!quizMode);
  };
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const toggleSkipMode = () => {
    setSkipMode(!skipMode);
  };
  return (
    <GameSettingsContext
      value={{
        quizMode,
        skipMode,
        darkMode,
        setDarkMode,
        setQuizMode,
        setSkipMode,
        toggleQuizMode,
        toggleSkipMode,
        toggleDarkMode,
      }}
    >
      {children}
    </GameSettingsContext>
  );
};
export const useGameSettings = () => useContext(GameSettingsContext);
