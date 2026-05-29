import React from "react";
import { Search, SlidersHorizontal, FolderOpen } from "lucide-react";
import type { Difficulty, Category } from "../types";
import { EmptyState } from "../components/ui/EmptyState";
import { Alert } from "../components/ui/Alert";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ChallengeCard } from "../components/ctf/ChallengeCard";
import { useChallenges } from "../features/challenges/hooks";
import { useAuthStore } from "../stores/authStore";

export function ChallengesPage() {
  const user = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<Category | "All">("All");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty | "All">("All");
  const [selectedStatus, setSelectedStatus] = React.useState<"All" | "Solved" | "Unsolved">("All");

  // Fetch challenges dynamically using TanStack Query
  const { data, isLoading, error } = useChallenges({
    search: searchQuery,
    category: selectedCategory,
    difficulty: selectedDifficulty,
  });

  const categoriesList: Array<Category | "All"> = [
    "All",
    "Web Exploitation",
    "Reverse Engineering",
    "Cryptography",
    "Forensics",
    "Pwn",
    "OSINT",
    "Steganography",
  ];

  const difficultiesList: Array<Difficulty | "All"> = ["All", "Easy", "Medium", "Hard", "Insane"];

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedDifficulty("All");
    setSelectedStatus("All");
  };

  // Get challenge list from envelope response
  const rawChallenges = data?.data?.challenges || [];

  // Filter solved status client-side since GORM endpoints return is_solved per session
  const filteredChallenges = rawChallenges.filter((ch) => {
    if (selectedStatus === "Solved" && !ch.is_solved) return false;
    if (selectedStatus === "Unsolved" && ch.is_solved) return false;
    return true;
  });

  // Dynamically compute competitor metrics
  const solvedCount = rawChallenges.filter((c) => c.is_solved).length;
  const totalScore = rawChallenges
    .filter((c) => c.is_solved)
    .reduce((acc, c) => acc + c.points, 0);

  return (
    <div className="w-full min-h-[calc(100vh-160px)] py-4 select-text text-left space-y-8">
      {/* HEADER INDEX */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.04] pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-cyan mb-1.5 uppercase tracking-wider font-bold select-none">
            <FolderOpen className="h-4 w-4" />
            02 // VECTORS INDEX
          </div>
          <h1 className="font-display font-light text-3xl text-slate-50 tracking-tight uppercase leading-none">
            Active Target Index <span className="font-semibold text-slate-500">({rawChallenges.length})</span>
          </h1>
          <p className="font-sans text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Browse verified security vector instances, query sandbox connection strings, and submit key hashes.
          </p>
        </div>

        {/* Counter Widget */}
        <div className="flex gap-4 p-3 bg-[#0d0d0d] border border-slate-800 font-mono text-[10px] select-none h-fit">
          <div>
            <span className="text-slate-500 block font-bold">ARENA COMPLETED</span>
            <span className="text-cyber-emerald font-bold text-xs">
              {solvedCount} / {rawChallenges.length} Solves
            </span>
          </div>
          <div className="w-[1px] bg-slate-800 mx-2"></div>
          <div>
            <span className="text-slate-500 block font-bold">TOTAL SCORE</span>
            <span className="text-cyber-cyan font-bold text-xs">{totalScore} PTS</span>
          </div>
        </div>
      </div>

      {/* SEARCH AND INTERACTIVE FILTERS CONTROLLER */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Left Side: Filter Control Hub */}
        <div className="xl:col-span-1 space-y-5 p-5 bg-[#0d0d0d] border border-slate-800/80">
          <div className="flex items-center gap-1.5 pb-3 border-b border-slate-800 text-[10px] font-mono font-bold tracking-wider text-slate-400 select-none">
            <SlidersHorizontal className="h-3.5 w-3.5 text-cyber-cyan" />
            FILTER CONSOLE PARAMETERS
          </div>

          {/* Search Query */}
          <div className="space-y-2">
            <label className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold select-none">
              Query Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Query keyword, tag..."
                value={searchQuery}
                aria-label="Search trials"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-cyber-cyan rounded p-2.5 pl-9 text-xs text-slate-100 font-mono focus:outline-none transition-colors"
              />
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-600" />
            </div>
          </div>

          {/* Difficulty Dropdowns */}
          <div className="space-y-2">
            <label className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold select-none">
              Difficulty Tier
            </label>
            <div className="flex flex-wrap gap-1.5">
              {difficultiesList.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 text-[10px] font-mono border transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? "bg-cyber-cyan/10 text-cyber-cyan border-cyber-cyan/40 font-bold"
                      : "bg-slate-950 text-slate-450 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Status Selectors */}
          <div className="space-y-2">
            <label className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block font-bold select-none">
              Solve Status
            </label>
            <div className="grid grid-cols-3 gap-1 rounded bg-slate-950 p-1 border border-slate-800">
              {(["All", "Solved", "Unsolved"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`py-1 rounded text-[9px] font-mono text-center transition-all cursor-pointer ${
                    selectedStatus === status
                      ? "bg-slate-900 border border-slate-800 text-slate-100 font-bold"
                      : "text-slate-500 hover:text-slate-350"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Clear Filter Option */}
          {(selectedCategory !== "All" ||
            selectedDifficulty !== "All" ||
            selectedStatus !== "All" ||
            searchQuery !== "") && (
            <button
              onClick={resetFilters}
              className="w-full text-center py-2.5 border border-dashed border-slate-800 hover:border-cyber-cyan/40 rounded font-mono text-[10px] text-slate-400 hover:text-cyber-cyan hover:bg-cyber-cyan/2 transition-all cursor-pointer font-bold uppercase tracking-wider"
            >
              Reset Current Filters
            </button>
          )}
        </div>

        {/* Right Side: Category Slider + Grid Cards */}
        <div className="xl:col-span-3 space-y-6">
          {/* Quick Category Tab Horizontal Line */}
          <div className="border-b border-slate-900 overflow-x-auto select-none scroller-hidden">
            <div className="flex gap-1.5 pb-2 min-w-max">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 font-display text-xs sm:text-sm font-medium tracking-wider border-b-2 transition-all uppercase cursor-pointer ${
                    selectedCategory === cat
                      ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/5 font-semibold"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Counts and Sort metrics */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
            <span className="uppercase tracking-wider">SHOWING {filteredChallenges.length} OF {rawChallenges.length} TARGET VECTORS</span>
            <span className="uppercase tracking-wider font-bold">ORDER: POINT VALUE ASCENDING</span>
          </div>

          {/* ERROR ALERT DISPLAY */}
          {error && (
            <div className="py-6">
              <Alert variant="error" title="SYNCHRONIZATION ERROR" className="max-w-full">
                Unable to synchronize challenge grid. Check backend connection.
              </Alert>
            </div>
          )}

          {/* LOADING STATE DISPLAY */}
          {isLoading && (
            <div className="w-full py-16 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}

          {/* CHALLENGES MATRIX BOARD */}
          {!isLoading && !error && (
            filteredChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredChallenges.map((ch) => (
                  <ChallengeCard key={ch.id} challenge={ch} />
                ))}
              </div>
            ) : (
              <EmptyState 
                title={rawChallenges.length === 0 ? "NO ACTIVE CHALLENGES AVAILABLE YET" : "NO VECTORS RESOLVED"}
                description={
                  rawChallenges.length === 0
                    ? (user?.role === "admin"
                      ? "Initialize challenges via the admin panel console to stage new vectors."
                      : "The arena coordinators have not provisioned any challenge tasks yet. Check back soon.")
                    : "No challenges match current filters."
                }
                onActionClick={rawChallenges.length === 0 ? undefined : resetFilters} 
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
