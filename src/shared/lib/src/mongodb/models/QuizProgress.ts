import { model, models, Schema } from "mongoose";

export interface IQuizProgress {
  userId: string;
  sessionId: string;
  currentQuestionIndex: number;
  correctAnswers: number;
  totalQuestions: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuizProgressSchema = new Schema<IQuizProgress>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    currentQuestionIndex: {
      type: Number,
      required: true,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound unique index on userId and sessionId
QuizProgressSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

export const QuizProgress =
  models.QuizProgress ||
  model<IQuizProgress>("QuizProgress", QuizProgressSchema);
