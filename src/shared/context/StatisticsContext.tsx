"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

import { statisticsApi, UserStatistics } from "@app/lib/client";

interface StatisticsContextType {
  statistics: UserStatistics | null;
  isLoading: boolean;
  refreshStatistics: () => Promise<void>;
}

const StatisticsContext = createContext<StatisticsContextType>({
  statistics: null,
  isLoading: true,
  refreshStatistics: async () => {},
});

export const useStatistics = () => {
  const context = useContext(StatisticsContext);
  if (!context) {
    throw new Error("useStatistics must be used within a StatisticsProvider");
  }
  return context;
};

interface StatisticsProviderProps {
  children: React.ReactNode;
}

export const StatisticsProvider: React.FC<StatisticsProviderProps> = ({
  children,
}) => {
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshStatistics = async () => {
    try {
      const stats = await statisticsApi.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStatistics();
  }, []);

  return (
    <StatisticsContext.Provider
      value={{
        statistics,
        isLoading,
        refreshStatistics,
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};
