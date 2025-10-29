import "server-only";

import { connectToDatabase } from "../connection";
import { UserSettings, type IUserSettings } from "../models";

export class UserSettingsService {
  /**
   * Get user settings by session ID, creates default settings if not found
   */
  static async getSettings(sessionId: string): Promise<IUserSettings> {
    await connectToDatabase();

    let settings = await UserSettings.findOne({ sessionId });

    if (!settings) {
      console.log("Creating new settings for session:", sessionId);
      settings = await UserSettings.create({
        sessionId,
        theme: "dark",
        quizMode: true,
        skipMode: true,
        isLocked: false,
        settingsOpen: false,
      });
    }

    const settingsObj = settings.toObject();
    return settingsObj;
  }

  /**
   * Update theme setting
   */
  static async toggleTheme(sessionId: string): Promise<"light" | "dark"> {
    await connectToDatabase();

    const settings = await this.getSettings(sessionId);
    const newTheme = settings.theme === "light" ? "dark" : "light";

    await UserSettings.findOneAndUpdate(
      { sessionId },
      { theme: newTheme },
      { upsert: true, new: true }
    );

    return newTheme;
  }

  /**
   * Delete/reset theme to default
   */
  static async deleteTheme(sessionId: string): Promise<void> {
    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { sessionId },
      { theme: "dark" },
      { upsert: true }
    );
  }

  /**
   * Toggle quiz mode
   */
  static async toggleQuizMode(sessionId: string): Promise<boolean> {
    await connectToDatabase();

    const settings = await this.getSettings(sessionId);
    const newQuizMode = !settings.quizMode;

    await UserSettings.findOneAndUpdate(
      { sessionId },
      { quizMode: newQuizMode },
      { upsert: true, new: true }
    );

    return newQuizMode;
  }

  /**
   * Toggle skip mode
   */
  static async toggleSkipMode(sessionId: string): Promise<boolean> {
    await connectToDatabase();

    const settings = await this.getSettings(sessionId);
    const newSkipMode = !settings.skipMode;

    await UserSettings.findOneAndUpdate(
      { sessionId },
      { skipMode: newSkipMode },
      { upsert: true, new: true }
    );

    return newSkipMode;
  }

  /**
   * Set lock state
   */
  static async setLock(sessionId: string, isLocked: boolean): Promise<void> {
    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { sessionId },
      { isLocked },
      { upsert: true }
    );
  }

  /**
   * Toggle settings modal open state
   */
  static async toggleSettingsOpen(sessionId: string): Promise<boolean> {
    await connectToDatabase();

    const settings = await this.getSettings(sessionId);
    const newSettingsOpen = !settings.settingsOpen;

    await UserSettings.findOneAndUpdate(
      { sessionId },
      { settingsOpen: newSettingsOpen },
      { upsert: true, new: true }
    );

    return newSettingsOpen;
  }
}
