import { UserCheck, ShieldCheck, Trophy, Layers } from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { PageLoading } from "../components/ui/PageLoading";
import { ConnectionError } from "../components/ui/ConnectionError";
import { Alert } from "../components/ui/Alert";
import { DifficultyBadge } from "../components/ctf/DifficultyBadge";
import { useProfileSummary } from "../features/profile/hooks";
import { mapBackendCategoryToUI } from "../features/challenges/api";

export function ProfilePage() {
  const { data: summaryRes, isLoading, error, refetch } = useProfileSummary();

  // Loading State Display
  if (isLoading) {
    return <PageLoading message="Synchronizing operator profile..." />;
  }

  // Error State Display
  if (error || !summaryRes?.success) {
    return <ConnectionError onRetry={refetch} />;
  }

  const { user, stats, recent_solves, solved_challenges, category_breakdown } = summaryRes.data;

  const points = stats.total_points;
  const globalRank = stats.rank !== null ? `#${stats.rank}` : "UNRANKED";
  const solvesCount = stats.total_solves;
  const categoriesCount = stats.total_categories_solved;

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-4 select-text text-left space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-ui pb-6 select-none">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyber-cyan mb-1.5 uppercase tracking-wider font-bold">
            <UserCheck className="h-4 w-4" />
            04 // COMPETITOR CONSOLE
          </div>
          <h1 className="font-display font-light text-3xl text-fg tracking-tight uppercase leading-none">
            PLAYER PROFILE <span className="font-semibold text-fg-muted">({user.name})</span>
          </h1>
          <p className="font-sans text-fg-muted text-xs sm:text-sm mt-2 leading-relaxed">
            Monitor secure identity params, platform progression, and credentials tunnels.
          </p>
        </div>
      </div>

      {/* Prominent Empty State Alert */}
      {solvesCount === 0 && (
        <div className="max-w-full text-left select-none animate-fade-in">
          <Alert variant="info" title="PROFILE STATUS: REGISTERED">
            No solves yet. Start solving challenges to build your profile.
          </Alert>
        </div>
      )}

      {/* CORE IDENTITY & STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN LEFT: SUMMARY STATS & CATEGORY PROGRESS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STAT CARDS ROW */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="OVERALL POINTS" value={`${points} PTS`} accent />
            <StatCard label="LEADERBOARD RANK" value={globalRank} />
            <StatCard label="SOLVES COMPLETED" value={`${solvesCount} solves`} />
            <StatCard label="DOMAINS SOLVED" value={`${categoriesCount} tracks`} />
          </div>

          {/* USER PROFILE DETAILS CARD */}
          <div className="p-6 bg-card-bg border border-border-ui space-y-4">
            <h3 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none">
              00 // SECURE IDENTITY PARAMS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-fg-subtle uppercase tracking-widest text-[9px] block">Competitor Name</span>
                <div className="text-fg uppercase tracking-wider font-bold">{user.name}</div>
              </div>
              <div className="space-y-1">
                <span className="text-fg-subtle uppercase tracking-widest text-[9px] block">Node Address (Email)</span>
                <div className="text-fg select-all">{user.email}</div>
              </div>
              <div className="space-y-1">
                <span className="text-fg-subtle uppercase tracking-widest text-[9px] block">System Privilege (Role)</span>
                <div className="text-cyber-cyan uppercase tracking-wider font-bold">{user.role}</div>
              </div>
              <div className="space-y-1">
                <span className="text-fg-subtle uppercase tracking-widest text-[9px] block">Established Link (Created)</span>
                <div className="text-fg uppercase font-bold">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  }) : "ESTABLISHED SESSION"}
                </div>
              </div>
            </div>
          </div>

          {/* CATEGORIES PROGRESS INDEX */}
          <div className="p-6 bg-card-bg border border-border-ui space-y-6">
            <h3 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none">01 // DOMAIN MATRIX PROGRESS</h3>
            
            <div className="space-y-4">
              {category_breakdown && category_breakdown.length > 0 ? (
                category_breakdown.map((progress) => {
                  // We map percentage based on overall player points or just show a nice proportional block
                  const percentage = points > 0 ? (progress.points / points) * 100 : 0;
                  
                  return (
                    <div key={progress.category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono select-none">
                        <span className="text-fg font-bold uppercase tracking-wider">
                          {mapBackendCategoryToUI(progress.category)}
                        </span>
                        <span className="text-fg-muted font-bold">
                          {progress.solves} {progress.solves === 1 ? 'solve' : 'solves'} ({progress.points} PTS)
                        </span>
                      </div>
                      {/* Visual Progress Bar */}
                      <div className="w-full h-1.5 bg-bg border border-border-subtle overflow-hidden rounded-none select-none">
                        <div 
                          className="h-full bg-cyber-cyan transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 select-none font-mono text-[10px] text-fg-subtle flex flex-col items-center justify-center gap-2">
                  <Layers className="h-5 w-5 text-fg-subtle/50 mb-1" />
                  No category distribution data available.
                </div>
              )}
            </div>
          </div>

          {/* SOLVED CHALLENGE HISTORY TABLE */}
          <div className="p-6 bg-card-bg border border-border-ui space-y-4">
            <h3 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none">
              03 // SOLVED CHALLENGE HISTORY
            </h3>
            {solved_challenges && solved_challenges.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border-ui text-fg-subtle select-none text-[10px]">
                      <th className="py-2.5 font-bold uppercase tracking-wider">Challenge</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider">Category</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider">Difficulty</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider">Points</th>
                      <th className="py-2.5 font-bold uppercase tracking-wider">Solved At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {solved_challenges.map((solve) => (
                      <tr key={solve.challenge_id} className="hover:bg-surface/30 transition-colors">
                        <td className="py-2.5 font-bold text-fg uppercase tracking-wide">{solve.title}</td>
                        <td className="py-2.5 text-[#7B9FFF] font-bold uppercase">{mapBackendCategoryToUI(solve.category)}</td>
                        <td className="py-2.5"><DifficultyBadge difficulty={solve.difficulty as any} /></td>
                        <td className="py-2.5 text-cyber-cyan font-bold">+{solve.points} PTS</td>
                        <td className="py-2.5 text-fg-muted">
                          {new Date(solve.solved_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 select-none font-mono text-[10px] text-fg-subtle flex flex-col items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-fg-subtle/50 mb-1" />
                No solved challenges in history index.
              </div>
            )}
          </div>

        </div>

        {/* COLUMN RIGHT: RECENT SOLVES FEED */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-card-bg border border-border-ui space-y-4 min-h-[300px]">
            <h4 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-cyber-cyan" />
              02 // SOLVES TIMELINE
            </h4>
            
            <div className="space-y-4 text-left">
              {recent_solves && recent_solves.length > 0 ? (
                recent_solves.map((solve) => (
                  <div key={solve.challenge_id} className="border-l border-cyber-cyan/30 pl-3 py-0.5 space-y-1 select-text animate-fade-in">
                    <div className="font-mono text-[9px] text-[#7B9FFF] uppercase tracking-wider font-bold select-none">
                      {mapBackendCategoryToUI(solve.category)}
                    </div>
                    <h5 className="font-display font-bold text-xs text-fg uppercase tracking-wide leading-tight truncate">
                      {solve.title}
                    </h5>
                    <div className="flex justify-between items-center text-[9px] font-mono text-fg-subtle select-none">
                      <span>+{solve.points} PTS</span>
                      <span className="text-cyber-cyan font-bold">SOLVED</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 select-none font-mono text-[10px] text-fg-subtle leading-relaxed pt-20">
                  NO RECENT SOLVES RECORDED YET.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
