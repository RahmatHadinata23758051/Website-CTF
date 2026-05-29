import { UserCheck, ShieldCheck } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { useAuthStore } from "../stores/authStore";
import { useScoreboard } from "../features/scoreboard/hooks";
import { useChallenges } from "../features/challenges/hooks";
import { mapBackendCategoryToUI } from "../features/challenges/api";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  // Fetch real-time data from scoreboard and challenges endpoints
  const { data: scoreboardData } = useScoreboard();
  const { data: challengesRes } = useChallenges();

  const challenges = challengesRes?.data?.challenges || [];

  // Match the active logged-in user in scoreboard rankings
  const userScore = scoreboardData?.data?.scoreboard?.find((entry: any) => entry.user_id === user?.id);
  
  const points = userScore ? userScore.total_points : 0;
  const globalRank = userScore ? `#${userScore.rank}` : "UNRANKED";
  const solvesCount = userScore ? userScore.total_solves : 0;

  // Domain progression mapping calculated from real challenges database
  const categoriesList = ["Web", "Reverse", "Crypto", "Pwn", "OSINT", "Forensics", "Steganography", "Misc"];
  
  const categoriesProgress = categoriesList.map((cat) => {
    const catChallenges = challenges.filter((c) => c.category === cat);
    const solved = catChallenges.filter((c) => c.is_solved).length;
    return {
      category: cat,
      title: mapBackendCategoryToUI(cat),
      solved,
      total: catChallenges.length,
    };
  });

  // Solves timeline populated dynamically from solved challenges list
  const solvedChallenges = challenges.filter((c) => c.is_solved);

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-4 select-text text-left space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.04] pb-6 select-none">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyber-cyan mb-1.5 uppercase tracking-wider font-bold">
            <UserCheck className="h-4 w-4" />
            04 // COMPETITOR CONSOLE
          </div>
          <h1 className="font-display font-light text-3xl text-slate-50 tracking-tight uppercase leading-none">
            PLAYER PROFILE <span className="font-semibold text-slate-400">({user?.name || "OPERATOR"})</span>
          </h1>
          <p className="font-sans text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Monitor secure identity params, platform progression, and credentials tunnels.
          </p>
        </div>
      </div>

      {/* CORE IDENTITY & STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN LEFT: SUMMARY STATS & CATEGORY PROGRESS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STAT CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="OVERALL POINTS" value={`${points} PTS`} accent />
            <StatCard label="LEADERBOARD RANK" value={globalRank} />
            <StatCard label="SOLVES COMPLETED" value={`${solvesCount} solves`} />
          </div>

          {/* USER PROFILE DETAILS CARD */}
          <div className="p-6 bg-[#0c0c0c] border border-white/[0.04] space-y-4">
            <h3 className="font-mono font-bold text-[10px] text-slate-400 tracking-[0.2em] uppercase select-none">
              00 // SECURE IDENTITY PARAMS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] block">Competitor Name</span>
                <div className="text-slate-100 uppercase tracking-wider font-bold">{user?.name || "N/A"}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] block">Node Address (Email)</span>
                <div className="text-slate-100 select-all">{user?.email || "N/A"}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] block">System Privilege (Role)</span>
                <div className="text-cyber-cyan uppercase tracking-wider font-bold">{user?.role || "USER"}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-500 uppercase tracking-widest text-[9px] block">Established Link (Created)</span>
                <div className="text-slate-100 uppercase font-bold">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }) : "ESTABLISHED SESSION"}
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORIES PROGRESS INDEX */}
          <div className="p-6 bg-[#0c0c0c] border border-white/[0.04] space-y-6">
            <h3 className="font-mono font-bold text-[10px] text-slate-400 tracking-[0.2em] uppercase select-none">01 // DOMAIN MATRIX PROGRESS</h3>
            
            <div className="space-y-4">
              {categoriesProgress.some((c) => c.total > 0) ? (
                categoriesProgress.map((progress) => {
                  const percentage = progress.total > 0 ? (progress.solved / progress.total) * 100 : 0;
                  
                  return (
                    <div key={progress.category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono select-none">
                        <span className="text-slate-350 font-bold uppercase tracking-wider">{progress.title}</span>
                        <span className="text-slate-500 font-bold">{progress.solved} / {progress.total} SOLVED ({percentage.toFixed(0)}%)</span>
                      </div>
                      {/* Visual Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-950 border border-slate-900 overflow-hidden rounded-none select-none">
                        <div 
                          className="h-full bg-cyber-cyan transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 select-none font-mono text-[10px] text-slate-500">
                  [!] NO ACTIVE CHALLENGES STAGED IN ARENA DB
                </div>
              )}
            </div>
          </div>

        </div>

        {/* COLUMN RIGHT: RECENT SOLVES FEED */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-[#0c0c0c] border border-white/[0.04] space-y-4 min-h-[300px]">
            <h4 className="font-mono font-bold text-[10px] text-slate-400 tracking-[0.2em] uppercase select-none flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-cyber-cyan" />
              02 // SOLVES TIMELINE
            </h4>
            
            <div className="space-y-4 text-left">
              {solvedChallenges.length > 0 ? (
                solvedChallenges.map((solve) => (
                  <div key={solve.id} className="border-l border-cyber-cyan/30 pl-3 py-0.5 space-y-1 select-text animate-fade-in">
                    <div className="font-mono text-[9px] text-[#7B9FFF] uppercase tracking-wider font-bold select-none">
                      {mapBackendCategoryToUI(solve.category)}
                    </div>
                    <h5 className="font-display font-bold text-xs text-slate-150 uppercase tracking-wide leading-tight truncate">
                      {solve.title}
                    </h5>
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 select-none">
                      <span>+{solve.points} PTS</span>
                      <span className="text-cyber-cyan font-bold">SOLVED</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 select-none font-mono text-[10px] text-slate-550 leading-relaxed pt-20">
                  NO EXPLOITS REGISTERED YET.<br />
                  ENTER CHALLENGES GRID ARCADES TO CAPTURE FLAGS.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
