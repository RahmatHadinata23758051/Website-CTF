import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthStore();

  if (isLoading) {
    return (
      <div className="w-full min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-12 select-none">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return (
      <div className="w-full min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-12 select-none text-center animate-fade-in">
        <div className="max-w-md p-6 bg-[#0a0a0a] border border-cyber-crimson text-cyber-crimson font-mono text-xs shadow-2xl space-y-4">
          <div className="font-bold tracking-widest text-sm uppercase">
            [!] SECURITY WARNING: 403 FORBIDDEN
          </div>
          <div className="w-[1px] h-4 bg-cyber-crimson mx-auto"></div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            ADMINISTRATOR ACCESS PRIVILEGES ARE REQUIRED TO LOAD THIS WORKSPACE CONTROL SCHEMA.
            UNAUTHORIZED ATTEMPTS HAVE BEEN LOGGED.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="px-4 py-2 border border-cyber-crimson hover:bg-cyber-crimson hover:text-white transition-all duration-200 text-[10px] font-bold uppercase tracking-wider block"
            >
              Return to Arena Grid
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
