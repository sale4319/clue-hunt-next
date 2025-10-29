"use client";

export interface AuthUser {
  username: string;
  createdAt: Date;
}

export interface LoginResponse {
  success: boolean;
  user: AuthUser;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  user: AuthUser;
  error?: string;
}

export const authApi = {
  /**
   * Login user
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  },

  /**
   * Register new user
   */
  async register(
    username: string,
    password: string
  ): Promise<RegisterResponse> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }

    return data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await fetch("/api/auth/me");

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch {
      return null;
    }
  },

  /**
   * Delete current user account
   */
  async deleteAccount(): Promise<void> {
    const response = await fetch("/api/auth/delete", {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete account");
    }
  },
};
