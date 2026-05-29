import { Trophy, Crown, Users, Target } from "lucide-react";
import { useScoreboard } from "../features/scoreboard/hooks";
import { PodiumCard } from "../components/ctf/PodiumCard";
import { ScoreboardTable } from "../components/ctf/ScoreboardTable";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Alert } from "../components/ui/Alert";
import { EmptyState } from "../components/ui/EmptyState";
import type { ScoreboardUser } from "../features/scoreboard/types";

export function ScoreboardPage() {
  const { data, isLoading, error } = useScoreboard();

  const scoreboardList = data?.data?.scoreboard || [];

  // Extract top 3 podium leaders and lower rank lists
  const top3 = scoreboardList.slice(0, 3);
  const remainingList = scoreboardList.slice(3);

  // Compute total dynamic stats
  const totalSolvesCount = scoreboardList.reduce((acc, p) => acc + p.total_solves, 0);

  // Adaptive ordering for podium cards:
  // On 3 players: displays Second (left), First (center), Third (right).
  // On fewer: displays simple sorted rank order to prevent lookup null values.
  const getPodiumOrder = (list: ScoreboardUser[]) => {
    if (list.length < 3) {
      return [...list].sort((a, b) => a.rank - b.rank);
    }
    return [
      list.find((p) => p.rank === 2),
      list.find((p) => p.rank === 1),
      list.find((p) => p.rank === 3),
    ].filter(Boolean) as ScoreboardUser[];
  };

  const podiumOrder = getPodiumOrder(top3);

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-4 select-text text-left space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.04] pb-6 select-none">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyber-cyan mb-1.5 uppercase tracking-wider font-bold select-none">
            <Trophy className="h-4 w-4" />
            03 // SCOREBOARD STANDINGS
          </div>
          <h1 className="font-display font-light text-3xl text-slate-50 tracking-tight uppercase leading-none">
            LEADERBOARD <span className="font-semibold text-slate-400">ranks</span>
          </h1>
          <p className="font-sans text-slate-400 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
            Real-time score calculation index mapping successful flag captures across verified sandboxes.
          </p>
        </div>

        {/* Global Stats ticker */}
        <div className="flex gap-4 font-mono text-[10px] text-slate-550 uppercase tracking-widest bg-white/[0.01] border border-white/[0.04] p-3 select-none">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-500" />
            <span>PLAYERS: {scoreboardList.length} registered</span>
          </div>
          <span className="text-slate-800">|</span>
          <div className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-slate-500" />
            <span>SOLVES RECORDED: {totalSolvesCount}</span>
          </div>
        </div>
      </div>

      {/* ERROR ALERT DISPLAY */}
      {error && (
        <div className="py-4 text-left">
          <Alert variant="error" title="SYNCHRONIZATION ERROR">
            Unable to synchronize scoreboard. Check backend connection.
          </Alert>
        </div>
      )}

      {/* LOADING STATE DISPLAY */}
      {isLoading && (
        <div className="w-full py-20 flex items-center justify-center select-none">
          <LoadingSpinner />
        </div>
      )}

      {/* EMPTY STATE DISPLAY */}
      {!isLoading && !error && scoreboardList.length === 0 && (
        <div className="py-8">
          <EmptyState 
            title="NO SOLVES RECORDED" 
            description="No solves recorded yet. Be the first to capture a target vector!"
          />
        </div>
      )}

      {/* RENDER VIEWPORTS */}
      {!isLoading && !error && scoreboardList.length > 0 && (
        <>
          {/* VIP LEADER PODIUM PANELS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
            {podiumOrder.map((player) => (
              <PodiumCard key={player.user_id} player={player} />
            ))}
          </div>

          {/* LOWER RANKS STANDINGS TABLE */}
          {remainingList.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500 uppercase tracking-wider select-none font-bold">
                <Crown className="h-3.5 w-3.5 text-slate-600" />
                STANDINGS INDEX (RANK 04+)
              </div>
              <ScoreboardTable players={remainingList} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
