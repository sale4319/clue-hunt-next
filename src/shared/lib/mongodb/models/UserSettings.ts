import { Schema, model, models } from "mongoose";

export interface IUserSettings {
  userId: string; // Changed from sessionId to userId
  theme: "light" | "dark";
  quizMode: boolean;
  skipMode: boolean;
  isLocked: boolean;
  settingsOpen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "dark",
    },
    quizMode: {
      type: Boolean,
      default: true,
    },
    skipMode: {
      type: Boolean,
      default: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    settingsOpen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation during development hot reloading
export const UserSettings =
  models.UserSettings ||
  model<IUserSettings>("UserSettings", UserSettingsSchema);
