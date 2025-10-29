import "server-only";

import { connectToDatabase } from "../connection";
import { type IUserSettings, UserSettings } from "../models";

export class UserSettingsService {
  /**
   * Get user settings by user ID, creates default settings if not found
   */
  static async getSettings(userId: string): Promise<IUserSettings> {
    await connectToDatabase();

    let settings = await UserSettings.findOne({ userId });

    if (!settings) {
      settings = await UserSettings.create({
        userId,
        theme: "dark",
        quizMode: true,
        skipMode: true,
        isLocked: false,
        settingsOpen: false,
        timerEndDate: null,
      });
    } else if (settings.timerEndDate === undefined) {
      // Migration: Add timerEndDate field to existing documents
      settings = await UserSettings.findOneAndUpdate(
        { userId },
        { $set: { timerEndDate: null } },
        { new: true }
      );
    }

    const settingsObj = settings!.toObject();

    // Ensure timerEndDate is always present in the response
    if (settingsObj.timerEndDate === undefined) {
      settingsObj.timerEndDate = null;
    }

    return settingsObj;
  }

  /**
   * Update theme setting
   */
  static async toggleTheme(userId: string): Promise<"light" | "dark"> {
    await connectToDatabase();

    const settings = await this.getSettings(userId);
    const newTheme = settings.theme === "light" ? "dark" : "light";

    await UserSettings.findOneAndUpdate(
      { userId },
      { theme: newTheme },
      { upsert: true, new: true }
    );

    return newTheme;
  }

  /**
   * Delete/reset theme to default
   */
  static async deleteTheme(userId: string): Promise<void> {
    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId },
      { theme: "dark" },
      { upsert: true }
    );
  }

  /**
   * Toggle quiz mode
   */
  static async toggleQuizMode(userId: string): Promise<boolean> {
    await connectToDatabase();

    const settings = await this.getSettings(userId);
    const newQuizMode = !settings.quizMode;

    await UserSettings.findOneAndUpdate(
      { userId },
      { quizMode: newQuizMode },
      { upsert: true, new: true }
    );

    return newQuizMode;
  }

  /**
   * Toggle skip mode
   */
  static async toggleSkipMode(userId: string): Promise<boolean> {
    await connectToDatabase();

    const settings = await this.getSettings(userId);
    const newSkipMode = !settings.skipMode;

    await UserSettings.findOneAndUpdate(
      { userId },
      { skipMode: newSkipMode },
      { upsert: true, new: true }
    );

    return newSkipMode;
  }

  /**
   * Set lock state
   */
  static async setLock(userId: string, isLocked: boolean): Promise<void> {
    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId },
      { isLocked },
      { upsert: true }
    );
  }

  /**
   * Toggle settings modal open state
   */
  static async toggleSettingsOpen(userId: string): Promise<boolean> {
    await connectToDatabase();

    const settings = await this.getSettings(userId);
    const newSettingsOpen = !settings.settingsOpen;

    await UserSettings.findOneAndUpdate(
      { userId },
      { settingsOpen: newSettingsOpen },
      { upsert: true, new: true }
    );

    return newSettingsOpen;
  }

  /**
   * Set timer end date
   */
  static async setTimerEndDate(userId: string, endDate: number): Promise<void> {
    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId },
      { timerEndDate: endDate },
      { upsert: true }
    );
  }

  /**
   * Clear timer end date
   */
  static async clearTimerEndDate(userId: string): Promise<void> {
    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId },
      { timerEndDate: null },
      { upsert: true }
    );
  }

  /**
   * Delete user settings
   */
  static async deleteUserSettings(userId: string): Promise<boolean> {
    await connectToDatabase();

    try {
      const result = await UserSettings.deleteOne({ userId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting user settings:", error);
      return false;
    }
  }
}
