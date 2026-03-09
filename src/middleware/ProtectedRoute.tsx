import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";

interface Props {
  children: React.ReactNode;
  guestOnly?: boolean;
}

// ProtectedRoute no longer calls Amplify directly.
// It reads authStatus from UserContext (resolved once on app boot by UserProvider).
// This eliminates the async race that was causing the redirect loop.
const ProtectedRoute: React.FC<Props> = ({ children, guestOnly = false }) => {
  const { user, authStatus } = useUser();
  const location = useLocation();

  // ── Still resolving session ────────────────────────────────────────────────
  if (authStatus === "checking") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-600">
            Verifying session...
          </span>
        </div>
      </div>
    );
  }

  const authenticated = authStatus === "authenticated";

  // ── Guest-only routes (login / registro / recuperar) ──────────────────────
  if (guestOnly && authenticated) {
    const role = user?.role;
    const sub  = user?.sub;
    const home = role === "developer" ? `/user/developer/${sub}` : "/user/business";
    return <Navigate to={home} replace />;
  }

  // ── Protected routes ──────────────────────────────────────────────────────
  if (!guestOnly && !authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;