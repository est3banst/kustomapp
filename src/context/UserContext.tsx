import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
  type SetStateAction,
} from "react";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

export type User = {
  username:       string;
  email:          string;
  displayName?:   string;
  avatarUrl?:     string;
  role?:          "developer" | "business" | "admin";
  sub?:           string;
  emailVerified?: boolean;
};

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

type UserContextType = {
  user:            User | null;
  setUser:         React.Dispatch<SetStateAction<User | null>>;
  authStatus:      AuthStatus;
  isAuthenticated: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user,       setUserState]  = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");

  // setUser updates both user state and authStatus atomically.
  // Accepts a value or a functional updater (same API as useState setter).
  const setUser = (u: SetStateAction<User | null>) => {
    const next = u instanceof Function ? u(user) : u;
    setUserState(next);
    setAuthStatus(next ? "authenticated" : "unauthenticated");
  };

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        const [cognitoUser, attrs] = await Promise.all([
          getCurrentUser(),
          fetchUserAttributes(),
        ]);

        if (cancelled) return;

        const role = (attrs["custom:userRole"] ?? "business") as "developer" | "business";

        setUserState({
          username:    attrs.preferred_username ?? cognitoUser.username,
          email:       attrs.email ?? "",
          role,
          sub:         cognitoUser.userId,
          displayName: attrs.preferred_username ?? cognitoUser.username,
        });
        setAuthStatus("authenticated");
      } catch {
        // No active Cognito session — this is the normal unauthenticated path
        if (cancelled) return;
        setUserState(null);
        setAuthStatus("unauthenticated");
      }
    };

    boot();

    // Cleanup: if the effect re-fires (StrictMode) ignore the first run's result
    return () => { cancelled = true; };
  }, []); // empty deps — run once on mount

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        authStatus,
        isAuthenticated: authStatus === "authenticated",
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
};

export default UserContext;