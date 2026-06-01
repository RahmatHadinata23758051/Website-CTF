import React from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  Search,
  Calendar,
  TrendingUp,
  RefreshCw,
  Users,
  Terminal,
  Clock
} from "lucide-react";
import {
  useAdminSubmissions,
  useAdminSolves,
  useAdminSubmissionStats
} from "../../features/admin/submissions/hooks";
import { Button } from "../../components/ui/Button";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { Alert } from "../../components/ui/Alert";
import { useLocation, useNavigate } from "react-router-dom";

export function AdminMonitoringPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.toLowerCase();

  const subTab = path.endsWith("/solves") ? "solves" : "submissions";

  const setSubTab = (tab: "submissions" | "solves") => {
    if (tab === "solves") {
      navigate("/admin/solves");
    } else {
      navigate("/admin/submissions");
    }
  };

  // Telemetry stats refresh trigger
  const { data: statsData, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useAdminSubmissionStats();

  // Submission Filter States
  const [subSearch, setSubSearch] = React.useState("");
  const [debouncedSubSearch, setDebouncedSubSearch] = React.useState("");
  const [subCorrect, setSubCorrect] = React.useState("");
  const [subFrom, setSubFrom] = React.useState("");
  const [subTo, setSubTo] = React.useState("");
  const [subPage, setSubPage] = React.useState(1);

  // Solve Filter States
  const [solveSearch, setSolveSearch] = React.useState("");
  const [debouncedSolveSearch, setDebouncedSolveSearch] = React.useState("");
  const [solveCategory, setSolveCategory] = React.useState("");
  const [solveFrom, setSolveFrom] = React.useState("");
  const [solveTo, setSolveTo] = React.useState("");
  const [solvePage, setSolvePage] = React.useState(1);

  // Debouncing Search inputs
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSubSearch(subSearch);
      setSubPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [subSearch]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSolveSearch(solveSearch);
      setSolvePage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [solveSearch]);

  // Query submissions list
  const {
    data: subsData,
    isLoading: subsLoading,
    error: subsError,
    refetch: refetchSubs
  } = useAdminSubmissions({
    search: debouncedSubSearch || undefined,
    correct: subCorrect || undefined,
    from: subFrom || undefined,
    to: subTo || undefined,
    page: subPage,
    limit: 15
  });

  // Query solves list
  const {
    data: solvesData,
    isLoading: solvesLoading,
    error: solvesError,
    refetch: refetchSolves
  } = useAdminSolves({
    search: debouncedSolveSearch || undefined,
    category: solveCategory || undefined,
    from: solveFrom || undefined,
    to: solveTo || undefined,
    page: solvePage,
    limit: 15
  });

  const handleRefreshAll = () => {
    refetchStats();
    if (subTab === "submissions") {
      refetchSubs();
    } else {
      refetchSolves();
    }
  };

  // Stats calculation
  const stats = statsData?.data;
  const correctCount = stats?.correct_submissions || 0;
  const totalCount = stats?.total_submissions || 0;
  const ratio = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(1) : "0.0";

  const categories = ["Web", "Crypto", "Pwn", "Reverse", "Forensics", "Misc"];

  const formatTimestamp = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  };

  return (
    <div className="w-full space-y-8 select-text">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs text-cyber-violet mb-1.5 uppercase tracking-wider font-bold select-none">
            <Activity className="h-4 w-4 text-cyber-violet animate-pulse" />
            ADMIN TELEMETRY // FLAG SUBMISSIONS & SOLVE AUDIT
          </div>
          <h1 className="font-display font-light text-3xl text-fg tracking-tight uppercase leading-none">
            Activity Monitoring
          </h1>
          <p className="font-sans text-fg-muted text-xs sm:text-sm mt-2 leading-relaxed">
            Real-time tracking of flag submission attempts, challenge solves, and suspicious brute-force telemetry behaviors.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={handleRefreshAll}
          className="flex items-center gap-2 font-mono text-xs h-fit py-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          REFRESH HUB
        </Button>
      </div>

      {/* TELEMETRY STATS & SECURITY MONITOR */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-card-bg border border-border animate-pulse rounded" />
          ))}
        </div>
      ) : statsError || !stats ? (
        <Alert variant="error" title="TELEMETRY OFFLINE">
          Unable to synchronize dashboard statistics.
        </Alert>
      ) : (
        <div className="space-y-6">
          {/* STATS CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-card-bg border border-border flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-5 text-fg">
                <Terminal className="h-12 w-12" />
              </div>
              <span className="text-[10px] font-mono font-bold text-fg-subtle uppercase tracking-wider">TOTAL ATTEMPTS</span>
              <span className="text-2xl font-mono font-bold text-cyber-cyan mt-2">{stats.total_submissions}</span>
              <span className="text-[9px] font-mono text-fg-muted mt-1">Sum of correct and wrong flag submits</span>
            </div>

            <div className="p-4 bg-card-bg border border-border flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-5 text-fg">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <span className="text-[10px] font-mono font-bold text-fg-subtle uppercase tracking-wider">SUCCESS SOLVES</span>
              <span className="text-2xl font-mono font-bold text-cyber-emerald mt-2">{stats.total_solves}</span>
              <span className="text-[9px] font-mono text-fg-muted mt-1">Unique challenge solved markers</span>
            </div>

            <div className="p-4 bg-card-bg border border-border flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-5 text-fg">
                <XCircle className="h-12 w-12" />
              </div>
              <span className="text-[10px] font-mono font-bold text-fg-subtle uppercase tracking-wider">WRONG SUBMISSIONS</span>
              <span className="text-2xl font-mono font-bold text-cyber-crimson mt-2">{stats.wrong_submissions}</span>
              <span className="text-[9px] font-mono text-fg-muted mt-1">Failed validation flag input attempts</span>
            </div>

            <div className="p-4 bg-card-bg border border-border flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-3 top-3 opacity-5 text-fg">
                <Users className="h-12 w-12" />
              </div>
              <span className="text-[10px] font-mono font-bold text-fg-subtle uppercase tracking-wider">SOLVE ACCURACY</span>
              <span className="text-2xl font-mono font-bold text-cyber-amber mt-2">{ratio}%</span>
              {/* Progress visualizer */}
              <div className="w-full bg-slate-950 h-1 mt-2.5">
                <div
                  className="bg-cyber-amber h-full transition-all duration-500"
                  style={{ width: `${Math.min(parseFloat(ratio), 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* DUAL ALERT PANEL (Brute force & Heatmap) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brute force signal card */}
            <div className="p-5 bg-card-bg border border-border flex flex-col space-y-4">
              <div className="flex items-center gap-2 text-cyber-amber font-mono text-xs uppercase tracking-wider font-bold">
                <AlertTriangle className="h-4 w-4 animate-bounce text-cyber-amber" />
                Brute Force Indicators (Top Failed Submits)
              </div>
              <p className="text-[11px] text-fg-muted leading-relaxed font-sans">
                Review competitors generating exceptionally high failure footprints. Users with counts exceeding 15 wrong attempts are highlighted for administrator inspection.
              </p>

              {stats.top_wrong_submitters.length === 0 ? (
                <div className="h-32 border border-dashed border-border flex items-center justify-center text-xs font-mono text-fg-muted uppercase">
                  No failed submissions registered
                </div>
              ) : (
                <div className="space-y-2.5">
                  {stats.top_wrong_submitters.map((submitter) => {
                    const isSuspicious = submitter.wrong_count > 15;
                    return (
                      <div
                        key={submitter.user_id}
                        className={`flex items-center justify-between p-3 border font-mono text-xs ${
                          isSuspicious
                            ? "bg-cyber-crimson/5 border-cyber-crimson/30"
                            : "bg-slate-950/20 border-border"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyber-crimson animate-pulse" />
                          <span className="text-fg font-bold tracking-tight">{submitter.name}</span>
                          <span className="text-[9px] text-fg-muted font-light uppercase">
                            ({submitter.user_id.slice(0, 8)})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-[10px] font-bold ${
                            isSuspicious
                              ? "bg-cyber-crimson/15 text-cyber-crimson border border-cyber-crimson/30"
                              : "bg-slate-800 text-fg-subtle"
                          }`}>
                            {submitter.wrong_count} WRONG ATTEMPTS
                          </span>
                          {isSuspicious && (
                            <span className="text-[9px] font-bold text-cyber-amber uppercase tracking-tighter bg-cyber-amber/15 border border-cyber-amber/30 px-1.5 py-0.5 rounded">
                              RISK: HIGH
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Most attempted challenges card */}
            <div className="p-5 bg-card-bg border border-border flex flex-col space-y-4">
              <div className="flex items-center gap-2 text-cyber-cyan font-mono text-xs uppercase tracking-wider font-bold">
                <TrendingUp className="h-4 w-4 text-cyber-cyan" />
                Challenge Solve Activity & Attempt Velocity
              </div>
              <p className="text-[11px] text-fg-muted leading-relaxed font-sans">
                Real-time review of target challenges capturing the highest competitive engagement traffic across the lab workspace.
              </p>

              {stats.most_attempted_challenges.length === 0 ? (
                <div className="h-32 border border-dashed border-border flex items-center justify-center text-xs font-mono text-fg-muted uppercase">
                  No challenge activities registered
                </div>
              ) : (
                <div className="space-y-2.5">
                  {stats.most_attempted_challenges.map((challenge) => (
                    <div
                      key={challenge.challenge_id}
                      className="flex items-center justify-between p-3 bg-slate-950/20 border border-border font-mono text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan" />
                        <span className="text-fg font-bold tracking-tight">{challenge.title}</span>
                      </div>
                      <span className="bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 px-2.5 py-0.5 text-[10px] font-bold">
                        {challenge.attempt_count} TOTAL ATTEMPTS
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CORE LOGS SECTION */}
      <div className="space-y-6">
        {/* LOG SELECTOR BAR */}
        <div className="flex border-b" style={{ borderBottomColor: "var(--border)" }}>
          <button
            onClick={() => setSubTab("submissions")}
            className={`flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 font-bold transition-all duration-200 cursor-pointer ${
              subTab === "submissions"
                ? "border-cyber-violet text-cyber-violet bg-cyber-violet/5"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Terminal className="h-4 w-4" />
            Flag Submissions Log
          </button>
          <button
            onClick={() => setSubTab("solves")}
            className={`flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 font-bold transition-all duration-200 cursor-pointer ${
              subTab === "solves"
                ? "border-cyber-violet text-cyber-violet bg-cyber-violet/5"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            <Award className="h-4 w-4" />
            Correct Solves Log
          </button>
        </div>

        {/* LOG PANEL CONTROLS & TABLES */}
        {subTab === "submissions" ? (
          <div className="space-y-6 animate-fade-in">
            {/* SUBMISSIONS FILTERS */}
            <div className="flex flex-col xl:flex-row gap-4 p-4 bg-card-bg border border-border items-center justify-between">
              <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
                {/* Search */}
                <div className="relative min-w-[200px] w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search user, email, challenge..."
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    className="w-full bg-input-bg border border-border hover:border-border-strong focus:border-cyber-violet rounded p-2 pl-9 text-xs text-fg font-mono focus:outline-none transition-colors"
                  />
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-fg-subtle" />
                </div>

                {/* Correct Selector */}
                <select
                  value={subCorrect}
                  onChange={(e) => {
                    setSubCorrect(e.target.value);
                    setSubPage(1);
                  }}
                  className="bg-input-bg border border-border hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg-muted font-mono focus:outline-none cursor-pointer"
                >
                  <option value="">All Verification Results</option>
                  <option value="true">Correct Solves Only</option>
                  <option value="false">Incorrect Attempts Only</option>
                </select>

                {/* Date Ranges */}
                <div className="flex items-center gap-2 bg-input-bg border border-border rounded p-2 text-xs text-fg-muted font-mono">
                  <Calendar className="h-3.5 w-3.5 text-fg-subtle" />
                  <input
                    type="date"
                    value={subFrom}
                    onChange={(e) => {
                      setSubFrom(e.target.value);
                      setSubPage(1);
                    }}
                    title="From Date"
                    className="bg-transparent border-none focus:outline-none cursor-pointer text-fg text-[11px]"
                  />
                  <span className="text-fg-subtle px-1">to</span>
                  <input
                    type="date"
                    value={subTo}
                    onChange={(e) => {
                      setSubTo(e.target.value);
                      setSubPage(1);
                    }}
                    title="To Date"
                    className="bg-transparent border-none focus:outline-none cursor-pointer text-fg text-[11px]"
                  />
                </div>
              </div>

              {(subSearch || subCorrect || subFrom || subTo) && (
                <button
                  onClick={() => {
                    setSubSearch("");
                    setSubCorrect("");
                    setSubFrom("");
                    setSubTo("");
                    setSubPage(1);
                  }}
                  className="text-[10px] font-mono text-fg-subtle hover:text-cyber-cyan transition-colors uppercase font-bold tracking-wider cursor-pointer"
                >
                  Clear Submissions Filters
                </button>
              )}
            </div>

            {/* SUBMISSIONS LIST OPERATIONS TABLE */}
            {subsLoading ? (
              <div className="py-16 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : subsError || !subsData ? (
              <Alert variant="error" title="CONNECTION REJECTED">
                Unable to retrieve flag submission history log.
              </Alert>
            ) : subsData.data.submissions.length === 0 ? (
              <div className="py-16 border border-dashed border-border text-center text-xs font-mono text-fg-muted uppercase">
                No flag submissions matching parameters found
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full overflow-x-auto border border-border rounded bg-card-bg">
                  <table className="w-full border-collapse font-mono text-[11px] text-left">
                    <thead>
                      <tr className="bg-slate-900 border-b border-border text-fg-subtle uppercase text-[9px] select-none">
                        <th className="px-4 py-3 font-bold tracking-wider">Timestamp</th>
                        <th className="px-4 py-3 font-bold tracking-wider">Competitor</th>
                        <th className="px-4 py-3 font-bold tracking-wider">Challenge Target</th>
                        <th className="px-4 py-3 font-bold tracking-wider text-center">Status</th>
                        <th className="px-4 py-3 font-bold tracking-wider text-right">Payload Input</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {subsData.data.submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="px-4 py-3.5 whitespace-nowrap text-fg-subtle flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-fg-subtle/80" />
                            {formatTimestamp(sub.created_at)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="text-fg font-bold block">{sub.user.name}</span>
                            <span className="text-[9px] text-fg-muted block mt-0.5">{sub.user.email}</span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="text-fg font-bold block">{sub.challenge.title}</span>
                            <span className="text-[9px] text-fg-subtle block mt-0.5 uppercase">
                              {sub.challenge.category} // {sub.challenge.points} PTS
                            </span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-center">
                            {sub.is_correct ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/30 text-[9px] font-bold uppercase tracking-wider">
                                <CheckCircle2 className="h-3 w-3" />
                                Correct
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-cyber-crimson/10 text-cyber-crimson border border-cyber-crimson/30 text-[9px] font-bold uppercase tracking-wider">
                                <XCircle className="h-3 w-3" />
                                Incorrect
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right font-mono text-[10px] text-fg-muted font-semibold tracking-tighter">
                            <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded select-all">
                              {sub.submitted_flag_redacted}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {subsData.data.pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between border-t border-border pt-4 font-mono text-[11px] select-none">
                    <span className="text-fg-subtle">
                      Page {subsData.data.pagination.page} of {subsData.data.pagination.total_pages} (Total: {subsData.data.pagination.total} entries)
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setSubPage((prev) => Math.max(prev - 1, 1))}
                        disabled={subPage === 1}
                        className="px-2.5 py-1"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setSubPage((prev) => Math.min(prev + 1, subsData.data.pagination.total_pages))}
                        disabled={subPage === subsData.data.pagination.total_pages}
                        className="px-2.5 py-1"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* SOLVES FILTERS */}
            <div className="flex flex-col xl:flex-row gap-4 p-4 bg-card-bg border border-border items-center justify-between">
              <div className="flex flex-wrap gap-3 w-full xl:w-auto items-center">
                {/* Search */}
                <div className="relative min-w-[200px] w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search user, email, challenge..."
                    value={solveSearch}
                    onChange={(e) => setSolveSearch(e.target.value)}
                    className="w-full bg-input-bg border border-border hover:border-border-strong focus:border-cyber-violet rounded p-2 pl-9 text-xs text-fg font-mono focus:outline-none transition-colors"
                  />
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-fg-subtle" />
                </div>

                {/* Category Filter */}
                <select
                  value={solveCategory}
                  onChange={(e) => {
                    setSolveCategory(e.target.value);
                    setSolvePage(1);
                  }}
                  className="bg-input-bg border border-border hover:border-border-strong focus:border-cyber-violet rounded p-2 text-xs text-fg-muted font-mono focus:outline-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} Division
                    </option>
                  ))}
                </select>

                {/* Date Ranges */}
                <div className="flex items-center gap-2 bg-input-bg border border-border rounded p-2 text-xs text-fg-muted font-mono">
                  <Calendar className="h-3.5 w-3.5 text-fg-subtle" />
                  <input
                    type="date"
                    value={solveFrom}
                    onChange={(e) => {
                      setSolveFrom(e.target.value);
                      setSolvePage(1);
                    }}
                    title="From Date"
                    className="bg-transparent border-none focus:outline-none cursor-pointer text-fg text-[11px]"
                  />
                  <span className="text-fg-subtle px-1">to</span>
                  <input
                    type="date"
                    value={solveTo}
                    onChange={(e) => {
                      setSolveTo(e.target.value);
                      setSolvePage(1);
                    }}
                    title="To Date"
                    className="bg-transparent border-none focus:outline-none cursor-pointer text-fg text-[11px]"
                  />
                </div>
              </div>

              {(solveSearch || solveCategory || solveFrom || solveTo) && (
                <button
                  onClick={() => {
                    setSolveSearch("");
                    setSolveCategory("");
                    setSolveFrom("");
                    setSolveTo("");
                    setSolvePage(1);
                  }}
                  className="text-[10px] font-mono text-fg-subtle hover:text-cyber-cyan transition-colors uppercase font-bold tracking-wider cursor-pointer"
                >
                  Clear Solves Filters
                </button>
              )}
            </div>

            {/* SOLVES LIST OPERATIONS TABLE */}
            {solvesLoading ? (
              <div className="py-16 flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : solvesError || !solvesData ? (
              <Alert variant="error" title="CONNECTION REJECTED">
                Unable to retrieve correct solves log.
              </Alert>
            ) : solvesData.data.solves.length === 0 ? (
              <div className="py-16 border border-dashed border-border text-center text-xs font-mono text-fg-muted uppercase">
                No solves matching parameters found
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-full overflow-x-auto border border-border rounded bg-card-bg">
                  <table className="w-full border-collapse font-mono text-[11px] text-left">
                    <thead>
                      <tr className="bg-slate-900 border-b border-border text-fg-subtle uppercase text-[9px] select-none">
                        <th className="px-4 py-3 font-bold tracking-wider">Timestamp</th>
                        <th className="px-4 py-3 font-bold tracking-wider">Competitor</th>
                        <th className="px-4 py-3 font-bold tracking-wider">Challenge Title</th>
                        <th className="px-4 py-3 font-bold tracking-wider">Category</th>
                        <th className="px-4 py-3 font-bold tracking-wider text-right">Points Gained</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {solvesData.data.solves.map((slv) => (
                        <tr key={slv.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="px-4 py-3.5 whitespace-nowrap text-fg-subtle flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-fg-subtle/80" />
                            {formatTimestamp(slv.solved_at)}
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="text-fg font-bold block">{slv.user.name}</span>
                            <span className="text-[9px] text-fg-muted block mt-0.5">{slv.user.email}</span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className="text-fg font-bold">{slv.challenge.title}</span>
                          </td>
                          <td className="px-4 py-3.5 whitespace-nowrap uppercase">
                            <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] text-cyber-cyan font-bold tracking-wider rounded">
                              {slv.challenge.category}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right font-bold text-cyber-emerald whitespace-nowrap">
                            +{slv.challenge.points} PTS
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {solvesData.data.pagination.total_pages > 1 && (
                  <div className="flex items-center justify-between border-t border-border pt-4 font-mono text-[11px] select-none">
                    <span className="text-fg-subtle">
                      Page {solvesData.data.pagination.page} of {solvesData.data.pagination.total_pages} (Total: {solvesData.data.pagination.total} entries)
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setSolvePage((prev) => Math.max(prev - 1, 1))}
                        disabled={solvePage === 1}
                        className="px-2.5 py-1"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setSolvePage((prev) => Math.min(prev + 1, solvesData.data.pagination.total_pages))}
                        disabled={solvePage === solvesData.data.pagination.total_pages}
                        className="px-2.5 py-1"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
