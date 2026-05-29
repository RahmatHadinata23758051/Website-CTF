import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { LiveTicker } from "./LiveTicker";
import { Footer } from "./Footer";

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans relative antialiased selection:bg-cyber-cyan/20 select-text">
      {/* Dynamic matrix background texture */}
      <div className="absolute inset-0 bg-dot-matrix pointer-events-none opacity-50 z-0"></div>

      {/* Top infinite ticker track */}
      <LiveTicker />

      {/* Navigation header */}
      <Navbar />

      {/* Primary view content container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-10 relative z-10">
        <Outlet />
      </main>

      {/* Platform Footer */}
      <Footer />
    </div>
  );
}
