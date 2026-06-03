import { Link } from "react-router-dom";
import { Zap, Clock } from "lucide-react";
import { useRecentSolves } from "../../features/activity/hooks";
import { useAuthStore } from "../../stores/authStore";

// Category color mapping matching the platform design system
const categoryColors: Record<string, string> = {
  Web: "text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5",
  Reverse: "text-cyber-violet border-cyber-violet/30 bg-cyber-violet/5",
  Crypto: "text-cyber-amber border-cyber-amber/30 bg-cyber-amber/5",
  Pwn: "text-cyber-crimson border-cyber-crimson/30 bg-cyber-crimson/5",
  OSINT: "text-cyber-emerald border-cyber-emerald/30 bg-cyber-emerald/5",
  Forensics: "text-slate-300 border-slate-600/30 bg-slate-800/20",
  Steganography: "text-cyber-violet border-cyber-violet/30 bg-cyber-violet/5",
  Misc: "text-slate-400 border-slate-600/30 bg-slate-800/20",
};

function formatRelativeTime(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

interface RecentActivityFeedProps {
  limit?: number;
  compact?: boolean;
}

export function RecentActivityFeed({ limit = 10, compact = false }: RecentActivityFeedProps) {
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading, error } = useRecentSolves(limit);
  const activities = data?.data?.activities ?? [];

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-900/50 border border-slate-800/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-slate-800/40 font-mono text-[10px] text-slate-600 uppercase tracking-widest text-center">
        [!] ACTIVITY FEED UNAVAILABLE
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="p-6 border border-slate-800/40 font-mono text-[10px] text-slate-600 uppercase tracking-widest text-center">
        [NO RECENT SOLVES YET]
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {activities.map((activity, idx) => {
        const catColor = categoryColors[activity.challenge.category] ?? "text-slate-400 border-slate-600/30 bg-slate-800/20";
        return (
          <div
            key={`${activity.user.id}-${activity.challenge.id}-${idx}`}
            className={`flex items-center justify-between gap-3 p-3 border border-slate-800/40 bg-slate-950/30 hover:border-slate-700/60 hover:bg-slate-900/40 transition-all duration-200 ${compact ? "py-2" : ""}`}
          >
            {/* Left: Activity info */}
            <div className="flex items-center gap-3 min-w-0">
              <Zap className="h-3 w-3 text-cyber-cyan shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`font-mono font-bold text-[11px] text-slate-200 truncate max-w-[100px]`}>
                    {activity.user.name}
                  </span>
                  <span className="font-mono text-[10px] text-slate-600 shrink-0">solved</span>
                  <Link
                    to={`/challenges/${activity.challenge.slug}`}
                    className="font-mono font-bold text-[11px] text-cyber-cyan hover:text-slate-100 transition-colors truncate max-w-[120px]"
                  >
                    {activity.challenge.title}
                  </Link>
                </div>
                {!compact && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`font-mono text-[8px] font-bold uppercase tracking-wider border px-1.5 py-0.5 ${catColor}`}>
                      {activity.challenge.category}
                    </span>
                    <span className="font-mono text-[9px] text-slate-600">+{activity.challenge.points} pts</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Timestamp */}
            <div className="flex items-center gap-1 shrink-0">
              <Clock className="h-2.5 w-2.5 text-slate-700" />
              <span className="font-mono text-[9px] text-slate-600 tracking-wider">
                {formatRelativeTime(activity.solved_at)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
