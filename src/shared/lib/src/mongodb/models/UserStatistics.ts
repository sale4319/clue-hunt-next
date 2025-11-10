import { model, models, Schema } from "mongoose";

export interface IUserStatistics {
  userId: string;
  correctlyCompletedQuizzes: number; // Number of quizzes completed with 6/6 correct answers
  incorrectAnswers: number; // Total number of incorrect answers across all quizzes
  skipButtonClicks: number; // Total number of skip button clicks
  levelLocks: {
    start?: boolean;
    one?: boolean;
    two?: boolean;
    three?: boolean;
    four?: boolean;
    five?: boolean;
    six?: boolean;
  };
  completedLevelsMap: {
    start?: boolean;
    one?: boolean;
    two?: boolean;
    three?: boolean;
    four?: boolean;
    five?: boolean;
    six?: boolean;
  };
  completedQuizzesMap: {
    start?: boolean;
    one?: boolean;
    two?: boolean;
    three?: boolean;
    four?: boolean;
    five?: boolean;
    six?: boolean;
  };
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
    skipButtonClicks: {
      type: Number,
      required: true,
      default: 0,
    },
    levelLocks: {
      type: {
        start: { type: Boolean, default: false },
        one: { type: Boolean, default: false },
        two: { type: Boolean, default: false },
        three: { type: Boolean, default: false },
        four: { type: Boolean, default: false },
        five: { type: Boolean, default: false },
        six: { type: Boolean, default: false },
      },
      default: {},
    },
    completedLevelsMap: {
      type: {
        start: { type: Boolean, default: false },
        one: { type: Boolean, default: false },
        two: { type: Boolean, default: false },
        three: { type: Boolean, default: false },
        four: { type: Boolean, default: false },
        five: { type: Boolean, default: false },
        six: { type: Boolean, default: false },
      },
      default: {},
    },
    completedQuizzesMap: {
      type: {
        start: { type: Boolean, default: false },
        one: { type: Boolean, default: false },
        two: { type: Boolean, default: false },
        three: { type: Boolean, default: false },
        four: { type: Boolean, default: false },
        five: { type: Boolean, default: false },
        six: { type: Boolean, default: false },
      },
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const UserStatistics =
  models.UserStatistics ||
  model<IUserStatistics>("UserStatistics", UserStatisticsSchema);
