export interface UserSettings {
  userId: string;
  theme: string;
  quizMode: boolean;
  skipMode: boolean;
  isLocked: boolean;
  settingsOpen: boolean;
  timerEndDate: number | null;
  createdAt: string;
  updatedAt: string;
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

  async toggleSettingsModal(): Promise<boolean> {
    const response = await fetch("/api/settings/modal", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle settings modal");
    }

    const data = await response.json();
    return data.settingsOpen;
  },

  async setLock(isLocked: boolean): Promise<void> {
    const response = await fetch("/api/settings/lock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isLocked }),
    });

    if (!response.ok) {
      throw new Error("Failed to set lock");
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
