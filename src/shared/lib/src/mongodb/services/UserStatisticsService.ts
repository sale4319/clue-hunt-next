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
        skipButtonClicks: 0,
        timeLeft: 0,
        levelLocks: {},
        completedLevelsMap: {},
        completedQuizzesMap: {},
      });
    }

    return stats.toObject();
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

  static async isLevelAccessible(
    userId: string,
    level: "start" | "one" | "two" | "three" | "four" | "five" | "six"
  ): Promise<boolean> {
    await connectToDatabase();

    const stats = await UserStatistics.findOne({ userId });

    if (!stats) {
      // New user can only access "start" level
      return level === "start";
    }

    const levelLocks = stats.levelLocks || {};

    // "start" is always accessible
    if (level === "start") return true;

    // A level is accessible if it's explicitly unlocked (true in levelLocks)
    return levelLocks[level] === true;
  }

  static async setQuizCompleted(
    userId: string,
    quiz: "start" | "one" | "two" | "three" | "four" | "five" | "six",
    completed: boolean
  ): Promise<void> {
    await connectToDatabase();

    // Update the specific quiz completion status and get the updated document
    const stats = await UserStatistics.findOneAndUpdate(
      { userId },
      { $set: { [`completedQuizzesMap.${quiz}`]: completed } },
      { upsert: true, new: true }
    );

    if (!stats) return;

    // Count how many quizzes are completed (explicitly check for true)
    const completedQuizzesMap = stats.completedQuizzesMap || {};
    const allQuizzes: Array<
      "start" | "one" | "two" | "three" | "four" | "five" | "six"
    > = ["start", "one", "two", "three", "four", "five", "six"];

    const completedCount = allQuizzes.filter(
      (quizName) => completedQuizzesMap[quizName] === true
    ).length;

    // Update the total count
    await UserStatistics.findOneAndUpdate(
      { userId },
      { $set: { correctlyCompletedQuizzes: completedCount } }
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
          skipButtonClicks: 0,
          timeLeft: 0,
          levelLocks: {},
          completedLevelsMap: {},
          completedQuizzesMap: {},
        },
        $unset: {
          gameCompletedAt: "",
          completionTimeInSeconds: "",
        },
      },
      { new: true, upsert: true }
    );

    return stats!.toObject();
  }

  static async setTimeLeft(
    userId: string,
    timeLeft: number
  ): Promise<IUserStatistics> {
    await connectToDatabase();

    const stats = await UserStatistics.findOneAndUpdate(
      { userId },
      { $set: { timeLeft } },
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

  static async markGameCompleted(
    userId: string,
    timerEndDate?: number
  ): Promise<IUserStatistics> {
    await connectToDatabase();

    // Calculate completion time
    let completionTimeInSeconds = 0;
    const stats = await this.getStatistics(userId);

    console.log("Service: markGameCompleted called", {
      userId,
      timerEndDate,
      statsTimeLeft: stats.timeLeft,
      existingGameCompletedAt: stats.gameCompletedAt,
    });

    if (stats.timeLeft && stats.timeLeft > 0) {
      // Game was completed with time left
      const timeUsedMs = Math.max(0, 4 * 60 * 60 * 1000 - stats.timeLeft);
      completionTimeInSeconds = Math.floor(timeUsedMs / 1000);
      console.log("Service: Using timeLeft calculation:", {
        timeUsedMs,
        completionTimeInSeconds,
      });
    } else if (timerEndDate) {
      // Calculate from timer
      const currentTime = Date.now();
      const timeRemainingMs = Math.max(0, timerEndDate - currentTime);
      const timeUsedMs = 2 * 60 * 60 * 1000 - timeRemainingMs;
      completionTimeInSeconds = Math.max(0, Math.floor(timeUsedMs / 1000));
      console.log("Service: Using timerEndDate calculation:", {
        currentTime,
        timerEndDate,
        timeRemainingMs,
        timeUsedMs,
        completionTimeInSeconds,
      });
    } else {
      completionTimeInSeconds = 3600; // 1 hour default
      console.log(
        "Service: Using default completion time:",
        completionTimeInSeconds
      );
    }

    console.log("Service: Updating database with completion data:", {
      gameCompletedAt: new Date(),
      completionTimeInSeconds,
    });

    const updatedStats = await UserStatistics.findOneAndUpdate(
      { userId },
      {
        $set: {
          gameCompletedAt: new Date(),
          completionTimeInSeconds,
        },
      },
      { new: true, upsert: true }
    );

    console.log("Service: Database update result:", updatedStats?.toObject());
    return updatedStats!.toObject();
  }
}
