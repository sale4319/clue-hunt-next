export interface UserSettings {
  sessionId: string;
  theme: string;
  quizMode: boolean;
  skipMode: boolean;
  isLocked: boolean;
  settingsOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

export const settingsApi = {
  async getSettings(sessionId: string): Promise<UserSettings> {
    const response = await fetch(
      `/api/settings?sessionId=${encodeURIComponent(sessionId)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }

    return response.json();
  },

  async toggleTheme(sessionId: string): Promise<void> {
    const response = await fetch("/api/settings/theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle theme");
    }
  },

  async deleteTheme(sessionId: string): Promise<void> {
    const response = await fetch(
      `/api/settings/theme?sessionId=${encodeURIComponent(sessionId)}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete theme");
    }
  },

  async toggleSkipMode(sessionId: string): Promise<void> {
    const response = await fetch("/api/settings/skip-mode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle skip mode");
    }
  },

  async toggleQuizMode(sessionId: string): Promise<void> {
    const response = await fetch("/api/settings/quiz-mode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle quiz mode");
    }
  },

  async toggleSettingsModal(sessionId: string): Promise<boolean> {
    const response = await fetch("/api/settings/modal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle settings modal");
    }

    const data = await response.json();
    return data.settingsOpen;
  },

  async setLock(sessionId: string, isLocked: boolean): Promise<void> {
    const response = await fetch("/api/settings/lock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionId, isLocked }),
    });

    if (!response.ok) {
      throw new Error("Failed to set lock");
    }
  },
};
