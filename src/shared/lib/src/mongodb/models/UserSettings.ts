import { model, models, Schema } from "mongoose";

export interface IUserSettings {
  userId: string;
  theme: "light" | "dark";
  quizMode: boolean;
  skipMode: boolean;
  settingsOpen: boolean;
  timerEndDate: number | null;
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
    settingsOpen: {
      type: Boolean,
      default: false,
    },
    timerEndDate: {
      type: Number,
      default: null,
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
