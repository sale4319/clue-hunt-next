export interface UserStatistics {
  userId: string;
  correctlyCompletedQuizzes: number;
  incorrectAnswers: number;
  skipButtonClicks: number;
  timeLeft: number;
  levelLocks: {
    start?: boolean;
    one?: boolean;
    two?: boolean;
    three?: boolean;
    four?: boolean;
    five?: boolean;
    six?: boolean;
  };
  completedLevelsMap: {
    start?: boolean;
    one?: boolean;
    two?: boolean;
    three?: boolean;
    four?: boolean;
    five?: boolean;
    six?: boolean;
  };
  completedQuizzesMap: {
    start?: boolean;
    one?: boolean;
    two?: boolean;
    three?: boolean;
    four?: boolean;
    five?: boolean;
    six?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export const statisticsApi = {
  /**
   * Get user statistics
   */
  async getStatistics(): Promise<UserStatistics> {
    const response = await fetch("/api/statistics");

    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }

    return response.json();
  },

  /**
   * Increment incorrect answers count
   */
  async incrementIncorrectAnswers(count: number = 1): Promise<UserStatistics> {
    const response = await fetch("/api/statistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "incrementIncorrectAnswers", count }),
    });

    if (!response.ok) {
      throw new Error("Failed to increment incorrect answers");
    }

    return response.json();
  },

  /**
   * Increment skip button clicks count
   */
  async incrementSkipButtonClicks(): Promise<UserStatistics> {
    const response = await fetch("/api/statistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "incrementSkip" }),
    });

    if (!response.ok) {
      throw new Error("Failed to increment skip count");
    }

    return response.json();
  },

  /**
   * Reset user statistics
   */
  async resetStatistics(): Promise<UserStatistics> {
    const response = await fetch("/api/statistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "reset" }),
    });

    if (!response.ok) {
      throw new Error("Failed to reset statistics");
    }

    return response.json();
  },

  /**
   * Set lock state for a specific level
   */
  async setLevelLock(
    level: "start" | "one" | "two" | "three" | "four" | "five" | "six",
    isLocked: boolean
  ): Promise<void> {
    const response = await fetch("/api/statistics/level-lock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ level, isLocked }),
    });

    if (!response.ok) {
      throw new Error("Failed to set level lock");
    }
  },

  /**
   * Mark a level as completed
   */
  async setLevelCompleted(
    level: "start" | "one" | "two" | "three" | "four" | "five" | "six",
    completed: boolean
  ): Promise<void> {
    const response = await fetch("/api/statistics/level-completed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ level, completed }),
    });

    if (!response.ok) {
      throw new Error("Failed to set level completed");
    }
  },

  /**
   * Mark a quiz as completed with perfect score
   */
  async setQuizCompleted(
    quiz: "start" | "one" | "two" | "three" | "four" | "five" | "six",
    completed: boolean
  ): Promise<void> {
    const response = await fetch("/api/statistics/quiz-completed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quiz, completed }),
    });

    if (!response.ok) {
      throw new Error("Failed to set quiz completed");
    }
  },

  /**
   * Set time left in milliseconds when game is completed
   */
  async setTimeLeft(timeLeft: number): Promise<void> {
    const response = await fetch("/api/statistics/time-left", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timeLeft }),
    });

    if (!response.ok) {
      throw new Error("Failed to set time left");
    }
  },
};
