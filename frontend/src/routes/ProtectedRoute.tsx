import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ForbiddenPage } from "../pages/system/ForbiddenPage";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-12 select-none">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user && !user.accepted_rules_at && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (user && user.accepted_rules_at && location.pathname === "/onboarding") {
    return <Navigate to="/challenges" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <ForbiddenPage />;
  }

  return <Outlet />;
}
