import { useApolloClient } from "@apollo/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setTokenGetter } from "../apollo/client";
import type { User } from "../graphql/types";
import { clearStoredToken, getStoredToken, setStoredToken } from "./storage";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTokenGetter(() => token);
  }, [token]);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      const stored = await getStoredToken();
      if (!active) {
        return;
      }
      if (stored) {
        setToken(stored);
      }
      setIsLoading(false);
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const setSession = useCallback(async (nextToken: string, nextUser: User) => {
    await setStoredToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    await clearStoredToken();
    setToken(null);
    setUser(null);
    await client.clearStore();
  }, [client]);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      isAuthenticated: Boolean(token),
      setSession,
      signOut,
    }),
    [token, user, isLoading, setSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
