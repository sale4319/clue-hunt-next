import { model, models, Schema } from "mongoose";

export interface IUserStatistics {
  userId: string;
  correctlyCompletedQuizzes: number; // Number of quizzes completed with 6/6 correct answers
  incorrectAnswers: number; // Total number of incorrect answers across all quizzes
  completedLevels: number; // Number of levels successfully completed
  skipButtonClicks: number; // Total number of skip button clicks
  createdAt: Date;
  updatedAt: Date;
}

const UserStatisticsSchema = new Schema<IUserStatistics>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    correctlyCompletedQuizzes: {
      type: Number,
      required: true,
      default: 0,
    },
    incorrectAnswers: {
      type: Number,
      required: true,
      default: 0,
    },
    completedLevels: {
      type: Number,
      required: true,
      default: 0,
    },
    skipButtonClicks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const UserStatistics =
  models.UserStatistics ||
  model<IUserStatistics>("UserStatistics", UserStatisticsSchema);
