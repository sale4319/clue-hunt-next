import "server-only";

import { connectToDatabase } from "../connection";
import { type IQuizProgress, QuizProgress } from "../models";

export class QuizProgressService {
  static async getProgress(
    userId: string,
    sessionId: string
  ): Promise<IQuizProgress> {
    await connectToDatabase();

    let progress = await QuizProgress.findOne({ userId, sessionId });

    if (!progress) {
      progress = await QuizProgress.create({
        userId,
        sessionId,
        currentQuestionIndex: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        isCompleted: false,
        answers: [],
      });
    }

    return progress.toObject();
  }

  static async updateProgress(
    userId: string,
    sessionId: string,
    data: {
      currentQuestionIndex?: number;
      correctAnswers?: number;
      totalQuestions?: number;
      isCompleted?: boolean;
      answers?: number[];
    }
  ): Promise<IQuizProgress> {
    await connectToDatabase();

    const progress = await QuizProgress.findOneAndUpdate(
      { userId, sessionId },
      { $set: data },
      { new: true, upsert: true }
    );

    return progress!.toObject();
  }

  static async resetProgress(
    userId: string,
    sessionId: string
  ): Promise<IQuizProgress> {
    await connectToDatabase();

    const progress = await QuizProgress.findOneAndUpdate(
      { userId, sessionId },
      {
        $set: {
          currentQuestionIndex: 0,
          correctAnswers: 0,
          totalQuestions: 0,
          isCompleted: false,
          answers: [],
        },
      },
      { new: true, upsert: true }
    );

    return progress!.toObject();
  }

  static async deleteProgress(
    userId: string,
    sessionId: string
  ): Promise<boolean> {
    await connectToDatabase();

    try {
      const result = await QuizProgress.deleteOne({ userId, sessionId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting quiz progress:", error);
      return false;
    }
  }

  static async deleteAllProgress(userId: string): Promise<boolean> {
    await connectToDatabase();

    try {
      const result = await QuizProgress.deleteMany({ userId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting all quiz progress:", error);
      return false;
    }
  }
}
