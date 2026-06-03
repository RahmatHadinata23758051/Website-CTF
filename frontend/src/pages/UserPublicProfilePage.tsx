import { useParams, useNavigate, Link } from "react-router-dom";
import {
  UserCheck, Trophy, Layers, ShieldCheck, ArrowLeft, BarChart2,
} from "lucide-react";
import { usePublicUserProfile } from "../features/users/publicProfileHooks";
import { PageLoading } from "../components/ui/PageLoading";
import { StatCard } from "../components/ui/StatCard";
import { DifficultyBadge } from "../components/ctf/DifficultyBadge";
import { mapBackendCategoryToUI } from "../features/challenges/api";

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export function UserPublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, error } = usePublicUserProfile(id);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return <PageLoading message="Retrieving player profile..." />;
  }

  // ── 404 / error ───────────────────────────────────────────────────────────
  const isNotFound =
    !data?.success ||
    (error as any)?.response?.status === 404 ||
    (error as any)?.response?.data?.message === "User not found";

  if (error || isNotFound) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center select-none">
        <div className="w-16 h-16 border border-slate-800 bg-slate-950 flex items-center justify-center">
          <UserCheck className="h-7 w-7 text-slate-700" />
        </div>
        <div>
          <h2 className="font-mono font-bold text-sm text-slate-400 uppercase tracking-widest mb-1">
            PLAYER NOT FOUND
          </h2>
          <p className="font-mono text-[10px] text-slate-600 uppercase tracking-wider">
            This player does not exist or is not publicly available.
          </p>
        </div>
        <button
          id="public-profile-back-btn"
          onClick={() => navigate("/users")}
          className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-cyber-cyan border border-slate-800 hover:border-cyber-cyan/40 px-4 py-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Players
        </button>
      </div>
    );
  }

  const { user, stats, recent_solves, solved_challenges, category_breakdown } = data.data;
  const rank = stats.rank !== null ? `#${stats.rank}` : "UNRANKED";
  const initials = user.name.slice(0, 2).toUpperCase();

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-4 select-text text-left space-y-8">

      {/* Background accent */}
      <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] bg-cyber-violet/3 rounded-full filter blur-[100px] pointer-events-none" />

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border-ui pb-6 select-none">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyber-cyan mb-1.5 uppercase tracking-wider font-bold">
            <UserCheck className="h-4 w-4" />
            PLAYER PROFILE
          </div>
          <h1 className="font-display font-light text-3xl text-fg tracking-tight uppercase leading-none">
            {user.name}
          </h1>
          <p className="font-sans text-fg-muted text-xs mt-2">
            Joined {formatDate(user.created_at)}
          </p>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            id="public-profile-scoreboard-link"
            to="/scoreboard"
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-cyber-cyan border border-slate-800 hover:border-cyber-cyan/40 px-3 py-2 transition-colors"
          >
            <BarChart2 className="h-3.5 w-3.5" />
            Scoreboard
          </Link>
          <Link
            id="public-profile-back-link"
            to="/users"
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-200 border border-slate-800 hover:border-slate-700 px-3 py-2 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Players
          </Link>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="TOTAL POINTS"    value={`${stats.total_points} PTS`} accent />
        <StatCard label="GLOBAL RANK"     value={rank} />
        <StatCard label="CHALLENGES"      value={`${stats.total_solves} solves`} />
        <StatCard label="CATEGORIES"      value={`${stats.total_categories_solved} tracks`} />
      </div>

      {/* ── BODY GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT: identity + category breakdown + solve history */}
        <div className="lg:col-span-8 space-y-6">

          {/* Identity card */}
          <div className="p-6 bg-card-bg border border-border-ui space-y-4">
            <h3 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none">
              00 // COMPETITOR INFO
            </h3>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 shrink-0 flex items-center justify-center font-mono font-black text-lg border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan select-none">
                {initials}
              </div>
              <div className="space-y-1">
                <div className="font-mono font-bold text-sm text-fg uppercase tracking-wider">
                  {user.name}
                </div>
                <div className="font-mono text-[10px] text-fg-subtle uppercase tracking-wider">
                  Joined {formatDate(user.created_at)}
                </div>
                <div className="font-mono text-[10px] text-cyber-cyan uppercase tracking-wider font-bold">
                  {rank !== "UNRANKED" ? `Ranked ${rank}` : "UNRANKED"}
                </div>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div className="p-6 bg-card-bg border border-border-ui space-y-6">
            <h3 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none">
              01 // DOMAIN BREAKDOWN
            </h3>
            <div className="space-y-4">
              {category_breakdown.length > 0 ? (
                category_breakdown.map((cat) => {
                  const pct = stats.total_points > 0 ? (cat.points / stats.total_points) * 100 : 0;
                  return (
                    <div key={cat.category} className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono select-none">
                        <span className="text-fg font-bold uppercase tracking-wider">
                          {mapBackendCategoryToUI(cat.category)}
                        </span>
                        <span className="text-fg-muted font-bold">
                          {cat.solves} {cat.solves === 1 ? "solve" : "solves"} ({cat.points} PTS)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-bg border border-border-subtle overflow-hidden">
                        <div
                          className="h-full bg-cyber-cyan transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 select-none font-mono text-[10px] text-fg-subtle flex flex-col items-center justify-center gap-2">
                  <Layers className="h-5 w-5 text-fg-subtle/50 mb-1" />
                  No solves recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Solve history table */}
          <div className="p-6 bg-card-bg border border-border-ui space-y-4">
            <h3 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none">
              02 // SOLVE HISTORY
            </h3>
            {solved_challenges.length > 0 ? (
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
                        <td className="py-2.5 text-[#7B9FFF] font-bold uppercase">
                          {mapBackendCategoryToUI(solve.category)}
                        </td>
                        <td className="py-2.5">
                          <DifficultyBadge difficulty={solve.difficulty as any} />
                        </td>
                        <td className="py-2.5 text-cyber-cyan font-bold">+{solve.points} PTS</td>
                        <td className="py-2.5 text-fg-muted">{formatDateTime(solve.solved_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 select-none font-mono text-[10px] text-fg-subtle flex flex-col items-center justify-center gap-2">
                <Trophy className="h-5 w-5 text-fg-subtle/50 mb-1" />
                No solves recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: recent solves feed */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 bg-card-bg border border-border-ui space-y-4 min-h-[300px]">
            <h4 className="font-mono font-bold text-[10px] text-fg-muted tracking-[0.2em] uppercase select-none flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-cyber-cyan" />
              03 // RECENT SOLVES
            </h4>
            <div className="space-y-4 text-left">
              {recent_solves.length > 0 ? (
                recent_solves.map((solve) => (
                  <div
                    key={solve.challenge_id + solve.solved_at}
                    className="border-l border-cyber-cyan/30 pl-3 py-0.5 space-y-1 animate-fade-in"
                  >
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
                  NO RECENT SOLVES YET.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
