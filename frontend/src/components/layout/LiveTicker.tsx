import { Zap } from "lucide-react";
import { useOverviewStats } from "../../features/stats/hooks";

export function LiveTicker() {
  const { data: statsRes } = useOverviewStats();
  const stats = statsRes?.data;

  const totalChallenges = stats?.total_challenges ?? 0;
  const totalPlayers = stats?.total_players ?? 0;
  const totalSolves = stats?.total_solves ?? 0;

  const events = [
    "RBLXSEC LAB CORE ONLINE // CONNECTION SECURED",
    `${totalChallenges} ACTIVE CHALLENGE VECTORS STAGED`,
    `${totalPlayers} REGISTERED OPERATOR NODES`,
    `${totalSolves} EXPLOIT SOLVES RECORDED`,
    "CHALLENGE GRID SYNCHRONIZED // SUBMIT FLAGS THROUGH LAB PORTAL",
    "LEADERBOARD MATRIX ACTIVE // SCORES UPDATED LIVE",
    "BREAK THE LAB. CAPTURE THE FLAG.",
  ];

  // Repeat events to facilitate smooth infinite looping
  const repeatedEvents = [...events, ...events, ...events];

  return (
    <div className="w-full bg-[#0d0d0d] border-b border-slate-800 text-xs py-2 overflow-hidden select-none font-mono tracking-wider relative z-40">
      <div className="flex w-max items-center space-x-12 animate-ticker-scroll whitespace-nowrap">
        {repeatedEvents.map((ev, idx) => (
          <div key={idx} className="flex items-center space-x-2 text-slate-500 hover:text-slate-400 cursor-default">
            <Zap className="h-3 w-3 text-cyber-cyan animate-pulse shrink-0" />
            <span className="text-[10px] uppercase font-bold text-slate-400">{ev}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
