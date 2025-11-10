import "server-only";

import { connectToDatabase } from "../connection";
import { type IUserStatistics, UserStatistics } from "../models";

export class UserStatisticsService {
  static async getStatistics(userId: string): Promise<IUserStatistics> {
    await connectToDatabase();

    let stats = await UserStatistics.findOne({ userId });

    if (!stats) {
      stats = await UserStatistics.create({
        userId,
        correctlyCompletedQuizzes: 0,
        incorrectAnswers: 0,
        completedLevels: 0,
        skipButtonClicks: 0,
        levelLocks: {},
        completedLevelsMap: {},
      });
    }

    return stats.toObject();
  }

  static async incrementCorrectlyCompletedQuizzes(
    userId: string
  ): Promise<IUserStatistics> {
    await connectToDatabase();

    const stats = await UserStatistics.findOneAndUpdate(
      { userId },
      { $inc: { correctlyCompletedQuizzes: 1 } },
      { new: true, upsert: true }
    );

    return stats!.toObject();
  }

  static async incrementIncorrectAnswers(
    userId: string,
    count: number = 1
  ): Promise<IUserStatistics> {
    await connectToDatabase();

    const stats = await UserStatistics.findOneAndUpdate(
      { userId },
      { $inc: { incorrectAnswers: count } },
      { new: true, upsert: true }
    );

    return stats!.toObject();
  }

  static async incrementCompletedLevels(
    userId: string
  ): Promise<IUserStatistics> {
    await connectToDatabase();

    const stats = await UserStatistics.findOneAndUpdate(
      { userId },
      { $inc: { completedLevels: 1 } },
      { new: true, upsert: true }
    );

    return stats!.toObject();
  }

  static async incrementSkipButtonClicks(
    userId: string
  ): Promise<IUserStatistics> {
    await connectToDatabase();

    const stats = await UserStatistics.findOneAndUpdate(
      { userId },
      { $inc: { skipButtonClicks: 1 } },
      { new: true, upsert: true }
    );

    return stats!.toObject();
  }

  static async setLevelLock(
    userId: string,
    level: "start" | "one" | "two" | "three" | "four" | "five" | "six",
    isLocked: boolean
  ): Promise<void> {
    await connectToDatabase();

    await UserStatistics.findOneAndUpdate(
      { userId },
      { $set: { [`levelLocks.${level}`]: isLocked } },
      { upsert: true }
    );
  }

  static async setLevelCompleted(
    userId: string,
    level: "start" | "one" | "two" | "three" | "four" | "five" | "six",
    completed: boolean
  ): Promise<void> {
    await connectToDatabase();

    // When completing a level, also unlock it
    const updates: Record<string, boolean> = {
      [`completedLevelsMap.${level}`]: completed,
    };

    if (completed) {
      updates[`levelLocks.${level}`] = true;
    }

    await UserStatistics.findOneAndUpdate(
      { userId },
      { $set: updates },
      { upsert: true }
    );
  }

  static async resetStatistics(userId: string): Promise<IUserStatistics> {
    await connectToDatabase();

    const stats = await UserStatistics.findOneAndUpdate(
      { userId },
      {
        $set: {
          correctlyCompletedQuizzes: 0,
          incorrectAnswers: 0,
          completedLevels: 0,
          skipButtonClicks: 0,
          levelLocks: {},
          completedLevelsMap: {},
        },
      },
      { new: true, upsert: true }
    );

    return stats!.toObject();
  }

  static async deleteStatistics(userId: string): Promise<boolean> {
    await connectToDatabase();

    try {
      const result = await UserStatistics.deleteOne({ userId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting user statistics:", error);
      return false;
    }
  }
}
