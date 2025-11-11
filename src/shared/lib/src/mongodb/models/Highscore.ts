import { model, models, Schema } from "mongoose";

export interface IHighscore {
  userId: string;
  score: number;
  completionTimeInSeconds: number;
  incorrectAnswers: number;
  skipsUsed: number;
  submittedAt: Date;
}

const HighscoreSchema = new Schema<IHighscore>(
  {
    userId: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      index: true,
    },
    completionTimeInSeconds: {
      type: Number,
      required: true,
    },
    incorrectAnswers: {
      type: Number,
      required: true,
      default: 0,
    },
    skipsUsed: {
      type: Number,
      required: true,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for querying top scores efficiently
HighscoreSchema.index({ score: -1, submittedAt: -1 });

// Only allow one highscore per user - update existing if better score
HighscoreSchema.index({ userId: 1 }, { unique: true });

export const Highscore =
  models.Highscore || model<IHighscore>("Highscore", HighscoreSchema);
