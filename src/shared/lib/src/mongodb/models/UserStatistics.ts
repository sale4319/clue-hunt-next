import { model, models, Schema } from "mongoose";

export interface IUserStatistics {
  userId: string;
  correctlyCompletedQuizzes: number;
  incorrectAnswers: number;
  skipButtonClicks: number;
  timeLeft: number;
  gameCompletedAt?: Date;
  completionTimeInSeconds?: number;
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
    timeLeft: {
      type: Number,
      required: true,
      default: 0,
    },
    gameCompletedAt: {
      type: Date,
      required: false,
    },
    completionTimeInSeconds: {
      type: Number,
      required: false,
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
