import "server-only";

import { connectToDatabase } from "../connection";
import { type IUserSettings, UserSettings } from "../models";

export class UserSettingsService {
  static async getSettings(userId: string): Promise<IUserSettings> {
    await connectToDatabase();

    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          theme: "dark",
          quizMode: true,
          skipMode: true,
          timerEndDate: null,
          isAdmin: false,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

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

  static async deleteTheme(userId: string): Promise<void> {
    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId },
      { theme: "dark" },
      { upsert: true }
    );
  }

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

  static async setTimerEndDate(userId: string, endDate: number): Promise<void> {
    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId },
      { timerEndDate: endDate },
      { upsert: true }
    );
  }

  static async clearTimerEndDate(userId: string): Promise<void> {
    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId },
      { timerEndDate: null },
      { upsert: true }
    );
  }

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
