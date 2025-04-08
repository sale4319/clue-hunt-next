"use client";

import { createContext, ReactNode, useContext, useState } from "react";

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
  setDarkMode: (value: boolean) => {},
  setQuizMode: (value: boolean) => {},
  setSkipMode: (value: boolean) => {},
  toggleQuizMode: () => {},
  toggleDarkMode: () => {},
  toggleSkipMode: () => {},
};

const GameSettingsContext = createContext<GameSettingsType>(defaultValues);

export const GameSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [skipMode, setSkipMode] = useState<boolean>(false);

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
