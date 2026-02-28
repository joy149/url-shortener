import { useCallback, useEffect, useMemo, useState } from "react";
import { getMe, logout as logoutApi } from "../lib/api";
import { TOKEN_STORAGE_KEY } from "../lib/config";
import type { AuthUser } from "../types/api";

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string;
  isAuthenticated: boolean;
  loginWithToken: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

function readTokenFromUrl(): string | null {
  const url = new URL(window.location.href);
  let token = url.searchParams.get("token");

  if (!token && url.hash.startsWith("#")) {
    const hashParams = new URLSearchParams(url.hash.slice(1));
    token = hashParams.get("token");
    if (token) {
      url.hash = "";
    }
  }

  if (!token) {
    return null;
  }

  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, url.toString());

  return token;
}

function readAuthErrorFromUrl(): string | null {
  const url = new URL(window.location.href);
  const authError = url.searchParams.get("authError");

  if (!authError) {
    return null;
  }

  url.searchParams.delete("authError");
  window.history.replaceState({}, document.title, url.toString());
  return authError;
}

export function useAuth(): AuthState {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const bootstrap = useCallback(async () => {
    setLoading(true);
    const authError = readAuthErrorFromUrl();
    setError(authError ?? "");
    const url = new URL(window.location.href);
    const isPostLoginReturn = url.searchParams.get("postLogin") === "1";

    const tokenFromUrl = readTokenFromUrl();
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const activeToken = tokenFromUrl ?? storedToken;

    if (activeToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, activeToken);
      setToken(activeToken);
    } else {
      setToken(null);
    }

    if (!activeToken && !isPostLoginReturn) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await getMe(activeToken ?? undefined);
      setUser(profile);
    } catch (err) {
      if (activeToken) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
      }
      setUser(null);
      if (authError) {
        setError(authError);
      } else if (isPostLoginReturn) {
        setError("Login succeeded but session could not be loaded.");
      } else {
        setError(err instanceof Error ? err.message : "Unable to fetch user session");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const loginWithToken = useCallback(async (newToken: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setLoading(true);
    setError("");

    try {
      const profile = await getMe(newToken);
      setUser(profile);
    } catch (err) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      setUser(null);
      setError(err instanceof Error ? err.message : "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const currentToken = token;
    try {
      await logoutApi(currentToken ?? undefined);
    } catch {
      // Client-side logout should still continue.
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    setError("");
  }, [token]);

  return useMemo(
    () => ({
      token,
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      loginWithToken,
      logout,
    }),
    [token, user, loading, error, loginWithToken, logout],
  );
}
