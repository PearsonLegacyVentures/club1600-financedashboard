/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

const SESSION_KEY = "club1600-dev-session";

type AuthContextValue = {
  authenticated: boolean;
  checking: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const validateTemporaryCredentials = (username: string, password: string) =>
  username === "treasurer" && password === "1600";

async function readServerSession(): Promise<boolean | null> {
  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const type = response.headers.get("content-type") || "";
    if (!type.includes("application/json")) return null;
    const payload = (await response.json()) as { authenticated?: boolean };
    return Boolean(payload.authenticated);
  } catch {
    return null;
  }
}

export function TemporaryAuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      const server = await readServerSession();
      if (!active) return;
      if (server !== null) {
        setAuthenticated(server);
      } else if (import.meta.env.DEV && typeof window !== "undefined") {
        setAuthenticated(window.localStorage.getItem(SESSION_KEY) === "treasurer");
      }
      setChecking(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const type = response.headers.get("content-type") || "";
      if (type.includes("application/json")) {
        const payload = (await response.json()) as { ok?: boolean };
        if (response.ok && payload.ok) {
          setAuthenticated(true);
          return true;
        }
        return false;
      }
    } catch {
      // Vite dev does not serve Cloudflare Pages Functions. Local fallback is handled below.
    }

    if (import.meta.env.DEV && validateTemporaryCredentials(username, password)) {
      window.localStorage.setItem(SESSION_KEY, "treasurer");
      setAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Local development may not have Pages Functions.
    }
    if (typeof window !== "undefined") window.localStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ authenticated, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useTemporaryAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useTemporaryAuth must be used within TemporaryAuthProvider");
  return context;
}
