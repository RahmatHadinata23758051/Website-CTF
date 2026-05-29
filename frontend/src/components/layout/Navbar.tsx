import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Layers, Power, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { logout } from "../../features/auth/api";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const userPoints = 0; // Hide/reset points until real score/profile API integration
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "OP";

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Fail gracefully and clear client state locally
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navItemClass = (path: string) => {
    return `px-4 py-2 font-display text-xs sm:text-sm font-medium transition-all duration-200 border-b-2 hover:text-slate-50 uppercase tracking-wider ${
      isActive(path)
        ? "border-cyber-cyan text-slate-50 bg-cyber-cyan/5 font-semibold"
        : "border-transparent text-slate-500 hover:border-slate-800"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#080808]/80 backdrop-blur-md">
      {/* MODE CONTROLLER */}
      <div className="w-full bg-[#111111] border-b border-slate-800 text-[10px] py-1.5 px-4 flex flex-wrap items-center justify-between gap-2 max-w-7xl mx-auto md:px-8">
        <div className="flex items-center gap-2 text-slate-500">
          <span className="flex h-1.5 w-1.5 relative">
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-cyan"></span>
          </span>
          <span className="font-mono text-slate-500 tracking-widest uppercase">LAB ONLINE // SESSION ACTIVE</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[9px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-cyber-violet" />
            <span>ENCRYPTED LINK ON HTTPS</span>
          </div>
        </div>
      </div>

      {/* CORE NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-18 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3.5 hover:opacity-90 group transition-all">
          <img
            src="/favicon.svg"
            alt="RBLXSec logo"
            className="h-8 w-8 object-contain group-hover:brightness-110 transition-all duration-300 select-none"
          />
          <div className="text-left font-mono">
            <span className="font-bold text-slate-50 tracking-[0.2em] text-sm sm:text-base">
              RBLX<span className="text-cyber-cyan">SEC</span>
            </span>
            <div className="text-[7px] text-slate-500 tracking-widest uppercase -mt-1 select-none">SECURITY LABORATORY</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 h-full">
          <Link to="/" className={navItemClass("/")}>
            Overview
          </Link>
          <Link to="/challenges" className={navItemClass("/challenges")}>
            Challenges
          </Link>
          <Link to="/scoreboard" className={navItemClass("/scoreboard")}>
            Scoreboard
          </Link>
          <Link to="/profile" className={navItemClass("/profile")}>
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              Profile
            </div>
          </Link>
        </nav>

        {/* User Stats / Action Area */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 font-mono text-[9px] text-cyber-emerald bg-cyber-emerald/5 border border-cyber-emerald/20 px-2.5 py-1 uppercase tracking-wider rounded-sm mr-1 select-none font-bold">
            <span className="w-1.5 h-1.5 bg-cyber-emerald rounded-full animate-ping"></span>
            SYS LIVE
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end font-mono text-xs">
                <span className="text-slate-600 text-[8px] uppercase tracking-wider font-bold">Account Solves</span>
                <span className="text-cyber-cyan font-bold">{userPoints} PTS</span>
              </div>
              <Link
                to="/profile"
                className="h-9 w-9 rounded-none bg-slate-900 border border-slate-800 flex items-center justify-center text-cyber-cyan hover:border-cyber-cyan hover:bg-slate-800 transition-all font-mono font-bold text-xs tracking-tighter"
              >
                {initials}
              </Link>
              <button
                onClick={handleLogout}
                title="Disconnect Account"
                className="p-2 w-9 h-9 rounded-none bg-slate-900 border border-slate-800 hover:border-cyber-crimson hover:bg-cyber-crimson/5 text-slate-500 hover:text-cyber-crimson transition-all flex items-center justify-center cursor-pointer"
              >
                <Power className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 border border-slate-700 hover:border-slate-500 rounded text-xs text-slate-300 font-mono uppercase tracking-wider hover:text-slate-50 transition-all"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 bg-cyber-cyan hover:opacity-95 text-slate-950 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
          >
            <Layers className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* MOBILE NAV BAR DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full border-t border-slate-800 bg-[#080808] px-4 py-4 flex flex-col gap-2 animate-fade-in text-left">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full py-2.5 text-left px-3 rounded font-mono text-xs uppercase tracking-wider ${
              isActive("/") ? "bg-slate-900 text-cyber-cyan font-bold" : "text-slate-400"
            }`}
          >
            Overview
          </Link>
          <Link
            to="/challenges"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full py-2.5 text-left px-3 rounded font-mono text-xs uppercase tracking-wider ${
              isActive("/challenges") ? "bg-slate-900 text-cyber-cyan font-bold" : "text-slate-400"
            }`}
          >
            Challenges
          </Link>
          <Link
            to="/scoreboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full py-2.5 text-left px-3 rounded font-mono text-xs uppercase tracking-wider ${
              isActive("/scoreboard") ? "bg-slate-900 text-cyber-cyan font-bold" : "text-slate-400"
            }`}
          >
            Scoreboard
          </Link>
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full py-2.5 text-left px-3 rounded font-mono text-xs uppercase tracking-wider ${
              isActive("/profile") ? "bg-slate-900 text-cyber-cyan font-bold" : "text-slate-400"
            }`}
          >
            Profile
          </Link>
        </div>
      )}
    </header>
  );
}
