"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, AuthUser } from "../lib/api/auth";
import { getClientSessionId } from "../lib/clientSession";
import { settingsApi } from "../lib/api/settings";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

const PUBLIC_PATHS = ["/login"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);

      if (currentUser && isPublicPath) {
        router.push("/");
      } else if (!currentUser && !isPublicPath) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      if (!isPublicPath) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password);
    setUser(response.user);

    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push("/");
  };

  const register = async (username: string, password: string) => {
    const response = await authApi.register(username, password);
    setUser(response.user);

    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push("/");
  };

  const logout = async () => {
    try {
      const sessionId = getClientSessionId();
      const currentSettings = await settingsApi.getSettings(sessionId);

      if (currentSettings.settingsOpen) {
        await settingsApi.toggleSettingsModal(sessionId);
      }
    } catch (error) {
      console.error("Failed to close settings modal during logout:", error);
    }

    await authApi.logout();
    setUser(null);

    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
