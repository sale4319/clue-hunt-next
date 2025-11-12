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
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const router = useRouter();
  const pathname = usePathname();
  const { clearSettings } = useSettings();

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  const checkAuth = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);

      if (currentUser && isPublicPath) {
        router.push("/level/start");
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

  useEffect(() => {
    if (!user || isPublicPath) {
      return;
    }

    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, isPublicPath]);

  useEffect(() => {
    if (!user || isPublicPath) {
      return;
    }

    const checkInactivity = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        logout();
      }
    }, 60000);

    return () => clearInterval(checkInactivity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isPublicPath, lastActivity]);

  const login = async (username: string, password: string) => {
    const response = await authApi.login(username, password);
    setUser(response.user);
    setLastActivity(Date.now());
    router.push("/level/start");
  };

  const register = async (username: string, password: string) => {
    const response = await authApi.register(username, password);
    setUser(response.user);
    setLastActivity(Date.now());
    router.push("/level/start");
  };

  const logout = async () => {
    if (!isPublicPath) {
      localStorage.setItem("redirectAfterLogin", pathname);
    }

    clearSettings();
    await authApi.logout();
    setUser(null);

    window.location.href = "/login";
  };

  const deleteAccount = async () => {
    clearSettings();
    await authApi.deleteAccount();
    setUser(null);

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
