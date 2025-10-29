import { User, IUser } from "../models/User";
import { connectToDatabase } from "../connection";

export class AuthService {
  /**
   * Create a new user (simple registration - in production use proper password hashing)
   */
  static async createUser(
    username: string,
    password: string
  ): Promise<IUser | null> {
    await connectToDatabase();

    try {
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("Username already exists");
      }

      // In production, hash the password with bcrypt
      // For now, storing plain text for simplicity (NOT RECOMMENDED FOR PRODUCTION)
      const user = await User.create({
        username,
        password,
      });

      return user.toObject();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Authenticate user with username and password
   */
  static async authenticateUser(
    username: string,
    password: string
  ): Promise<IUser | null> {
    await connectToDatabase();

    try {
      const user = await User.findOne({ username });

      if (!user) {
        return null;
      }

      // In production, use bcrypt.compare() to verify hashed password
      if (user.password !== password) {
        return null;
      }

      return user.toObject();
    } catch (error) {
      console.error("Error authenticating user:", error);
      return null;
    }
  }

  /**
   * Get user by username
   */
  static async getUserByUsername(username: string): Promise<IUser | null> {
    await connectToDatabase();

    try {
      const user = await User.findOne({ username });
      return user ? user.toObject() : null;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  /**
   * Delete user (for testing/cleanup)
   */
  static async deleteUser(username: string): Promise<boolean> {
    await connectToDatabase();

    try {
      const result = await User.deleteOne({ username });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
}
