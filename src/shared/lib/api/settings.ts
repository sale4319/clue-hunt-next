export interface UserSettings {
  userId: string;
  theme: string;
  quizMode: boolean;
  skipMode: boolean;
  isLocked: boolean;
  settingsOpen: boolean;
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

  async toggleTheme(): Promise<void> {
    const response = await fetch("/api/settings/theme", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to toggle theme");
    }
  },

  async deleteTheme(): Promise<void> {
    const response = await fetch(`/api/settings/theme`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete theme");
    }
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
};
