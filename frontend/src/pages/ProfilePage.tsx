import { UserCheck, Cpu, Trophy, Sparkles } from "lucide-react";
import { MOCK_USER_STATS } from "../lib/mockData";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import { SectionHeader } from "../components/ui/SectionHeader";
import { useAuthStore } from "../stores/authStore";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const stats = MOCK_USER_STATS;

  // Unlocked badges mapping Phase 9 blueprint specifications
  const badges = [
    { name: "Exif Investigator", desc: "Restore any corrupted JPEG header matrix accurately.", rarity: "Common", unlocked: "2026-05-28", icon: Trophy },
    { name: "Cipher Desperado", desc: "Solve three advanced Cryptography encryption challenges in a single session.", rarity: "Epic", unlocked: "2026-05-27", icon: Sparkles },
    { name: "Lone Wolf Solves", desc: "Accumulate over 1,000 points without linking with any major clans or teams.", rarity: "Epic", unlocked: "2026-05-28", icon: Cpu }
  ];

  const getRarityBadgeStyles = (rarity: string) => {
    switch (rarity) {
      case "Legendary": return "text-cyber-cyan border-cyber-cyan/20 bg-cyber-cyan/5";
      case "Epic": return "text-cyber-violet border-cyber-violet/20 bg-cyber-violet/5";
      case "Rare": return "text-[#7B9FFF] border-[#7B9FFF]/20 bg-[#7B9FFF]/5";
      default: return "text-slate-400 border-slate-800 bg-[#121212]";
    }
  };

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
            PLAYER PROFILE <span className="font-semibold text-slate-400">({user?.name || stats.username})</span>
          </h1>
          <p className="font-sans text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Monitor secure identity params, platform progression, and credentials. <span className="text-cyber-cyan font-mono text-[10px] uppercase font-bold tracking-wider select-none bg-cyber-cyan/5 border border-cyber-cyan/15 px-2 py-0.5 ml-1 inline-block">Demo Simulator Mode</span>
          </p>
        </div>
      </div>

      {/* CORE IDENTITY & STATS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN LEFT: SUMMARY STATS & CATEGORY PROGRESS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STAT CARDS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="OVERALL POINTS" value={`${stats.points} PTS`} accent />
            <StatCard label="LEADERBOARD RANK" value={`#0${stats.globalRank}`} />
            <StatCard label="SOLVES COMPLETED" value={`${stats.solvesCount} solves`} />
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
              {Object.entries(stats.categoriesProgress).map(([cat, progress]) => {
                const percentage = progress.total > 0 ? (progress.solved / progress.total) * 100 : 0;
                
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono select-none">
                      <span className="text-slate-350 font-bold uppercase tracking-wider">{cat}</span>
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
              })}
            </div>
          </div>

          {/* UNLOCKED BADGES (ACHIEVEMENTS) */}
          <div className="space-y-4">
            <SectionHeader index="02" title="UNLOCKED ACHIEVEMENTS" description="Special achievement stamps unlocked by resolving insane constraints or maintaining session Streaks." />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {badges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <Card key={idx} className="min-h-[160px] relative hover:border-cyber-cyan/20 group">
                    <div className="flex items-start justify-between">
                      <div className="p-2 bg-slate-950 border border-slate-800 text-cyber-cyan">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`font-mono text-[8px] uppercase tracking-wider border px-2 py-0.5 font-bold rounded-none select-none ${getRarityBadgeStyles(badge.rarity)}`}>
                        {badge.rarity}
                      </span>
                    </div>
                    <div className="text-left mt-4">
                      <h4 className="font-display font-bold text-xs text-slate-100 uppercase tracking-wide truncate group-hover:text-cyber-cyan transition-colors">{badge.name}</h4>
                      <p className="font-sans text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">{badge.desc}</p>
                    </div>
                    <div className="border-t border-white/[0.03] pt-2.5 mt-3 flex items-center justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest select-none">
                      <span>UNLOCKED ON:</span>
                      <span className="font-bold">{badge.unlocked}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

        </div>

        {/* COLUMN RIGHT: RECENT SOLVES FEED */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-[#0c0c0c] border border-white/[0.04] space-y-4">
            <h4 className="font-mono font-bold text-[10px] text-slate-400 tracking-[0.2em] uppercase select-none">03 // SOLVES TIMELINE</h4>
            
            <div className="space-y-4 text-left">
              {stats.recentSolves.map((solve, idx) => (
                <div key={idx} className="border-l border-white/[0.06] pl-3 py-0.5 space-y-1 select-text">
                  <div className="font-mono text-[9px] text-[#7B9FFF] uppercase tracking-wider font-bold select-none">{solve.category}</div>
                  <h5 className="font-display font-bold text-xs text-slate-150 uppercase tracking-wide leading-tight truncate">{solve.challengeTitle}</h5>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 select-none">
                    <span>+{solve.points} PTS</span>
                    <span>{solve.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
