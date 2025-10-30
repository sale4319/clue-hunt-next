// Server-side exports only
export { connectToDatabase } from "./mongodb/connection";
export * from "./mongodb/models";
export { AuthService } from "./mongodb/services/AuthService";
export { QuizProgressService } from "./mongodb/services/QuizProgressService";
export { UserSettingsService } from "./mongodb/services/UserSettingsService";

// Type exports from API (for server-side use)
export type { AuthUser } from "./api/auth";
export type { UserSettings } from "./api/settings";
