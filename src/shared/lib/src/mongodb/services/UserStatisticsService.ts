import "server-only";

import { connectToDatabase } from "../connection";
import { type IUserStatistics, UserStatistics } from "../models";

export class UserStatisticsService {
  /**
   * Get user statistics, creates default if not found
   */
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
      });
    }

    return stats.toObject();
  }

  /**
   * Increment correctly completed quizzes count
   */
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

  /**
   * Increment incorrect answers count
   */
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

  /**
   * Increment completed levels count
   */
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

  /**
   * Increment skip button clicks count
   */
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

  /**
   * Reset user statistics
   */
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
        },
      },
      { new: true, upsert: true }
    );

    return stats!.toObject();
  }

  /**
   * Delete user statistics (called when deleting user account)
   */
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
