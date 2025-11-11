import "server-only";

import { connectToDatabase } from "../connection";
import { Highscore, type IHighscore } from "../models";

export interface HighscoreInput {
  userId: string;
  score: number;
  completionTimeInSeconds: number;
  incorrectAnswers: number;
  skipsUsed: number;
}

export interface HighscoreDisplay {
  userId: string;
  score: number;
  completionTimeInSeconds: number;
  incorrectAnswers: number;
  skipsUsed: number;
  submittedAt: Date;
  username?: string;
}

export class HighscoreService {
  static async saveHighscore(input: HighscoreInput): Promise<IHighscore> {
    await connectToDatabase();

    // Check if user already has a highscore
    const existingHighscore = await Highscore.findOne({ userId: input.userId });

    if (existingHighscore) {
      // Only update if the new score is higher
      if (input.score > existingHighscore.score) {
        const updatedHighscore = await Highscore.findOneAndUpdate(
          { userId: input.userId },
          {
            ...input,
            submittedAt: new Date(),
          },
          { new: true }
        );
        return updatedHighscore!.toObject();
      } else {
        // Return existing highscore if new score isn't better
        return existingHighscore.toObject();
      }
    } else {
      // Create new highscore
      const highscore = await Highscore.create({
        ...input,
        submittedAt: new Date(),
      });
      return highscore.toObject();
    }
  }

  static async getTopHighscores(
    limit: number = 10
  ): Promise<HighscoreDisplay[]> {
    await connectToDatabase();

    const highscores = await Highscore.find({})
      .sort({ score: -1, submittedAt: 1 })
      .limit(limit)
      .lean();

    return highscores.map((score) => ({
      ...score,
      username: `User ${score.userId.slice(-4)}`,
    })) as unknown as HighscoreDisplay[];
  }

  static async getUserHighscore(userId: string): Promise<IHighscore | null> {
    await connectToDatabase();

    const highscore = await Highscore.findOne({ userId });
    return highscore ? highscore.toObject() : null;
  }

  static async getUserRanking(userId: string): Promise<number | null> {
    await connectToDatabase();

    const userHighscore = await this.getUserHighscore(userId);
    if (!userHighscore) return null;

    const betterScoresCount = await Highscore.countDocuments({
      $or: [
        { score: { $gt: userHighscore.score } },
        {
          score: userHighscore.score,
          submittedAt: { $lt: userHighscore.submittedAt },
        },
      ],
    });

    return betterScoresCount + 1;
  }
}
