import { useLocation, useNavigate } from "react-router-dom";
import { Layers, Users, Activity } from "lucide-react";
import { AdminChallengesPage } from "../AdminChallengesPage";
import { AdminUsersPage } from "./AdminUsersPage";
import { AdminMonitoringPage } from "./AdminMonitoringPage";

export function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.toLowerCase();

  let activeTab: "challenges" | "users" | "monitoring" = "challenges";
  if (path.endsWith("/users")) {
    activeTab = "users";
  } else if (path.endsWith("/submissions") || path.endsWith("/solves")) {
    activeTab = "monitoring";
  }

  const handleTabChange = (tab: "challenges" | "users" | "monitoring") => {
    if (tab === "challenges") {
      navigate("/admin/challenges");
    } else if (tab === "users") {
      navigate("/admin/users");
    } else if (tab === "monitoring") {
      navigate("/admin/submissions");
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-4 select-text text-left space-y-6">
      {/* Unified Tab Switcher Bar */}
      <div 
        className="flex border-b select-none transition-colors duration-200"
        style={{ borderBottomColor: "var(--border)" }}
      >
        <button
          onClick={() => handleTabChange("challenges")}
          className={`flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 font-bold transition-all duration-200 cursor-pointer ${
            activeTab === "challenges"
              ? "border-cyber-violet text-cyber-violet bg-cyber-violet/5"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <Layers className="h-4 w-4" />
          Challenges Management
        </button>
        <button
          onClick={() => handleTabChange("users")}
          className={`flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 font-bold transition-all duration-200 cursor-pointer ${
            activeTab === "users"
              ? "border-cyber-violet text-cyber-violet bg-cyber-violet/5"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <Users className="h-4 w-4" />
          User Management
        </button>
        <button
          onClick={() => handleTabChange("monitoring")}
          className={`flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 font-bold transition-all duration-200 cursor-pointer ${
            activeTab === "monitoring"
              ? "border-cyber-violet text-cyber-violet bg-cyber-violet/5"
              : "border-transparent text-slate-500 hover:text-slate-300"
          }`}
        >
          <Activity className="h-4 w-4" />
          Activity Monitoring
        </button>
      </div>

      {/* Render active view with animation/fade */}
      <div className="w-full animate-fade-in">
        {activeTab === "challenges" ? (
          <AdminChallengesPage />
        ) : activeTab === "users" ? (
          <AdminUsersPage />
        ) : (
          <AdminMonitoringPage />
        )}
      </div>
    </div>
  );
}


