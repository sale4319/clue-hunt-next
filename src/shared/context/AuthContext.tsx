"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { authApi, AuthUser } from "@app/lib/client";

import { useSettings } from "./SettingsContext";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  deleteAccount: async () => {},
});

const PUBLIC_PATHS = ["/login"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { clearSettings } = useSettings();

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

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

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password);
    setUser(response.user);
    router.push("/");
  };

  const register = async (username: string, password: string) => {
    const response = await authApi.register(username, password);
    setUser(response.user);
    router.push("/");
  };

  const logout = async () => {
    if (!isPublicPath) {
      localStorage.setItem("redirectAfterLogin", pathname);
    }

    clearSettings();
    await authApi.logout();
    setUser(null);

    // Full page reload to clear all state
    window.location.href = "/login";
  };

  const deleteAccount = async () => {
    clearSettings();
    await authApi.deleteAccount();
    setUser(null);

    // Full page reload and redirect to login
    window.location.href = "/login";
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
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
