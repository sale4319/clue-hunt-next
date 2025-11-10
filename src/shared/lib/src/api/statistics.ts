export interface UserStatistics {
  userId: string;
  correctlyCompletedQuizzes: number;
  incorrectAnswers: number;
  completedLevels: number;
  skipButtonClicks: number;
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
   * Increment correctly completed quizzes count
   */
  async incrementCorrectlyCompletedQuizzes(): Promise<UserStatistics> {
    const response = await fetch("/api/statistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "incrementQuiz" }),
    });

    if (!response.ok) {
      throw new Error("Failed to increment quiz count");
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
   * Increment completed levels count
   */
  async incrementCompletedLevels(): Promise<UserStatistics> {
    const response = await fetch("/api/statistics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "incrementLevel" }),
    });

    if (!response.ok) {
      throw new Error("Failed to increment level count");
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
};
