"use client";

/**
 * Client-side session management using localStorage
 */

const SESSION_KEY = "clue_hunt_session_id";

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Get or create a session ID from localStorage
 */
export function getClientSessionId(): string {
  if (typeof window === "undefined") {
    // Server-side, return a temporary ID
    return "server-temp";
  }

  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
    console.log("Created new client session:", sessionId);
  }

  return sessionId;
}

/**
 * Clear the session (logout)
 */
export function clearClientSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}
