import { Crown, UserCheck } from "lucide-react";
import type { ScoreboardUser } from "../../features/scoreboard/types";
import { useAuthStore } from "../../stores/authStore";

interface PodiumCardProps {
  player: ScoreboardUser;
}

export function formatSolveTime(timeStr: string | null): string {
  if (!timeStr) return "-";
  try {
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return "-";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  } catch {
    return "-";
  }
}

export function PodiumCard({ player }: PodiumCardProps) {
  const currentUser = useAuthStore((state) => state.user);
  const isSelf = currentUser && currentUser.id === player.user_id;

  const getPodiumStyles = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-cyber-cyan bg-card-bg shadow-[0_0_25px_rgba(200,255,0,0.03)]";
      case 2:
        return "border-border-ui bg-card-bg";
      case 3:
        return "border-[#FF9F7B]/30 bg-card-bg";
      default:
        return "border-border-subtle bg-card-bg";
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-cyber-cyan border-cyber-cyan/20 bg-cyber-cyan/10";
      case 2:
        return "text-[#7B9FFF] border-[#7B9FFF]/20 bg-[#7B9FFF]/10";
      case 3:
        return "text-[#FF9F7B] border-[#FF9F7B]/20 bg-[#FF9F7B]/10";
      default:
        return "text-fg-subtle border border-border-subtle bg-bg";
    }
  };

  return (
    <div
      className={`p-6 border ${getPodiumStyles(
        player.rank
      )} relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between min-h-[220px] text-left`}
    >
      {/* Crown decoration for rank 1 */}
      {player.rank === 1 && (
        <div className="absolute top-4 right-4 animate-pulse select-none">
          <Crown className="h-4.5 w-4.5 text-cyber-cyan" />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span
            className={`h-8 w-8 rounded-none border text-xs font-mono font-bold flex items-center justify-center select-none ${getRankBadgeColor(
              player.rank
            )}`}
          >
            0{player.rank}
          </span>

          <div className="flex-grow min-w-0">
            <h3 className="font-mono font-bold text-sm text-fg flex items-center gap-1.5 truncate uppercase tracking-wider">
              {player.name}
              {isSelf && <UserCheck className="h-3.5 w-3.5 text-cyber-emerald shrink-0" />}
            </h3>
            <span className="font-mono text-[9px] text-fg-subtle tracking-widest uppercase font-bold select-none">
              {isSelf ? "ACTIVE SESSION" : "PARTICIPANT"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-4 font-mono">
          <div>
            <span className="text-[9px] text-fg-subtle block uppercase tracking-wider font-bold select-none">
              ACCUMULATED
            </span>
            <span className="text-base font-black text-fg mt-1 block">
              {player.total_points} <span className="text-[9px] text-fg-subtle font-bold">PTS</span>
            </span>
          </div>
          <div>
            <span className="text-[9px] text-fg-subtle block uppercase tracking-wider font-bold select-none">
              VECTOR CHECKS
            </span>
            <span className="text-xs text-fg-muted mt-1 block font-bold">
              {player.total_solves} solves
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle pt-3 mt-4 text-[9px] font-mono uppercase tracking-wider text-fg-subtle select-none">
        <span>LAST SIGNATURE SOLVE:</span>
        <span className="text-cyber-cyan font-bold">{formatSolveTime(player.last_solve_time)}</span>
      </div>
    </div>
  );
}
