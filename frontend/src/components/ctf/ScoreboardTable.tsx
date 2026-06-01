import { useAuthStore } from "../../stores/authStore";
import type { ScoreboardUser } from "../../features/scoreboard/types";
import { formatSolveTime } from "./PodiumCard";

interface ScoreboardTableProps {
  players: ScoreboardUser[];
}

export function ScoreboardTable({ players }: ScoreboardTableProps) {
  const currentUser = useAuthStore((state) => state.user);

  return (
    <div className="p-4 bg-card-bg border border-border-ui overflow-x-auto select-text">
      <table className="w-full font-sans text-xs border-collapse min-w-[650px] text-left">
        <thead>
          <tr className="border-b border-border-ui font-mono text-[9px] text-fg-subtle uppercase tracking-widest text-left select-none">
            <th className="py-3 px-4 font-bold">RANK ID</th>
            <th className="py-3 px-4 font-bold">TARGET COMPETITOR</th>
            <th className="py-3 px-4 font-bold">STAGING LAB AFFILIATION</th>
            <th className="py-3 px-4 text-center font-bold">SOLVES</th>
            <th className="py-3 px-4 text-center font-bold">POINTS</th>
            <th className="py-3 px-4 text-right font-bold">LAST CAPTURED TIMESTAMP</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => {
            const isSelf = currentUser && currentUser.id === player.user_id;
            return (
              <tr
                key={player.user_id}
                className={`border-b border-border-subtle font-mono hover:bg-surface/50 transition-colors ${
                  isSelf ? "bg-cyber-emerald/5 border-l-2 border-l-cyber-emerald" : ""
                }`}
              >
                <td className="py-3.5 px-4 font-bold text-fg-subtle">
                  # {player.rank < 10 ? `0${player.rank}` : player.rank}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-fg uppercase tracking-wide">
                      {player.name}
                    </span>
                    {isSelf && (
                      <span className="bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20 px-1.5 py-0.2 font-mono text-[8px] uppercase tracking-wider font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-fg-subtle uppercase text-[9px] tracking-wider select-none">
                  {isSelf ? "ACTIVE CONTEXT" : "INDIVIDUAL"}
                </td>
                <td className="py-3.5 px-4 text-center text-fg-muted font-bold select-none">
                  {player.total_solves} solves
                </td>
                <td className="py-3.5 px-4 text-center text-[#7B9FFF] font-black select-none">
                  {player.total_points} pts
                </td>
                <td className="py-3.5 px-4 text-right text-fg-subtle select-none font-bold">
                  {formatSolveTime(player.last_solve_time)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
