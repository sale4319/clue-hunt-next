export interface Highscore {
  userId: string;
  score: number;
  completionTimeInSeconds: number;
  incorrectAnswers: number;
  skipsUsed: number;
  submittedAt: string;
  username?: string;
}

export interface HighscoreSubmission {
  score: number;
  completionTimeInSeconds: number;
  incorrectAnswers: number;
  skipsUsed: number;
}

export const highscoreApi = {
  /**
   * Submit a new highscore
   */
  async submitHighscore(highscore: HighscoreSubmission): Promise<Highscore> {
    const response = await fetch("/api/highscores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(highscore),
    });

    if (!response.ok) {
      throw new Error("Failed to submit highscore");
    }

    return response.json();
  },

  /**
   * Get top highscores
   */
  async getTopHighscores(limit: number = 10): Promise<Highscore[]> {
    const response = await fetch(`/api/highscores?limit=${limit}`);

    if (!response.ok) {
      throw new Error("Failed to fetch highscores");
    }

    return response.json();
  },
};
