import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "aws-amplify/auth";
import { useUser } from "@/context/UserContext";

interface Props {
  children: React.ReactNode;
  guestOnly?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, guestOnly = false }) => {
  const { user, setUser } = useUser();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const cognitoUser = await getCurrentUser();
        setAuthenticated(true);
        if (!user) {
          setUser({
            username: cognitoUser.username,
            email: cognitoUser.signInDetails?.loginId ?? "",
            sub: cognitoUser.userId,
          });
        }
      } catch {
        setAuthenticated(false);
        setUser(null);
      } finally {
        setChecking(false);
      }
    };
    verify();
  }, []);

  if (checking) {
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

  if (guestOnly && authenticated) {
    return <Navigate to="/user-page" replace />;
  }

  if (!guestOnly && !authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;