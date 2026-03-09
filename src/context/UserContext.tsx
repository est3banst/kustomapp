import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
  type SetStateAction,
} from "react";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

// ── Types ──────────────────────────────────────────────────────────────────────
export interface User {
  username:     string;
  email:        string;
  displayName?: string;
  avatarUrl?:   string;
  role?:        "developer" | "business" | "admin";
  sub?:         string;
  emailVerified?: boolean;
}

type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface UserContextType {
  user:            User | null;
  setUser:         React.Dispatch<React.SetStateAction<User | null>>;
  authStatus:      AuthStatus;
  isAuthenticated: boolean;
}

// ── Context ────────────────────────────────────────────────────────────────────
const UserContext = createContext<UserContextType | null>(null);

// ── Provider ───────────────────────────────────────────────────────────────────
// Resolves the Cognito session ONCE on app load.
// Login / Register set the user directly after signIn — no double-fetch.
// ProtectedRoute just reads authStatus; it never calls Amplify itself.
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user,       setUserState] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
  const booted = useRef(false);

  // Expose a setUser that also flips authStatus so ProtectedRoute reacts
  const setUser = (u: SetStateAction<User | null>) => {
    const newUser = u instanceof Function ? u(user) : u;
    setUserState(newUser);
    setAuthStatus(newUser ? "authenticated" : "unauthenticated");
  };

  useEffect(() => {
    // Only run once — if Login/Register already called setUser before this
    // effect fires (fast networks), don't overwrite their richer data.
    if (booted.current) return;
    booted.current = true;

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
        if (cancelled) return;
        setUserState(null);
        setAuthStatus("unauthenticated");
      }
    };

    boot();
    return () => { cancelled = true; };
  }, []);

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

// ── Hook ───────────────────────────────────────────────────────────────────────
export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
};

export default UserContext;