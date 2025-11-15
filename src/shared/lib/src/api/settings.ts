export interface UserSettings {
  userId: string;
  theme: "light" | "dark";
  quizMode: boolean;
  skipMode: boolean;
  timerEndDate: number | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const settingsApi = {
  async getSettings(): Promise<UserSettings> {
    const response = await fetch(`/api/settings`);

    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }

    return response.json();
  },

  async toggleSkipMode(): Promise<void> {
    const response = await fetch("/api/settings/skip-mode", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle skip mode");
    }
  },

  async toggleQuizMode(): Promise<void> {
    const response = await fetch("/api/settings/quiz-mode", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle quiz mode");
    }
  },

  async setTimerEndDate(endDate: number): Promise<void> {
    const response = await fetch("/api/settings/timer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endDate }),
    });

    if (!response.ok) {
      throw new Error("Failed to set timer");
    }
  },

  async clearTimerEndDate(): Promise<void> {
    const response = await fetch("/api/settings/timer", {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to clear timer");
    }
  },
};
