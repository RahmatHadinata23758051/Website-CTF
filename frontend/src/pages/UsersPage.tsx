import React from "react";
import { Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { UserDirectoryTable } from "../components/ctf/UserDirectoryTable";
import { useUserDirectory } from "../features/users/hooks";
import { SectionHeader } from "../components/ui/SectionHeader";
import { PageLoading } from "../components/ui/PageLoading";
import { ConnectionError } from "../components/ui/ConnectionError";
import { PageEmpty } from "../components/ui/PageEmpty";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function UsersPage() {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const limit = 20;

  const debouncedSearch = useDebounce(search, 300);

  const [prevSearch, setPrevSearch] = React.useState(debouncedSearch);
  if (prevSearch !== debouncedSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  const { data, isLoading, error, refetch } = useUserDirectory({
    search: debouncedSearch,
    page,
    limit,
  });

  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination;
  const totalPages = pagination?.total_pages ?? 1;
  const total = pagination?.total ?? 0;
  const pageOffset = (page - 1) * limit;

  return (
    <div className="space-y-8 text-left select-text">
      {/* Background accent */}
      <div className="absolute top-[10%] left-[5%] w-[350px] h-[350px] bg-cyber-violet/3 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Page Header */}
      <SectionHeader
        index="01"
        title="PLAYER DIRECTORY"
        description="Browse registered competitors, their rank, solve count, and total accumulated score."
        aside={
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-600 uppercase tracking-widest">
            <Users className="h-3.5 w-3.5" />
            {total > 0 ? `${total} PLAYERS` : "NO PLAYERS"}
          </div>
        }
      />

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600 pointer-events-none" />
        <input
          id="users-search"
          type="text"
          placeholder="Search by player name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800/80 pl-10 pr-4 py-3 font-mono text-sm text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-cyber-cyan/50 transition-colors"
        />
        {debouncedSearch && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors cursor-pointer"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="border border-slate-800/60 bg-slate-950/40">
        {/* Table header row */}
        <div className="border-b border-slate-800/60 px-4 py-3 flex items-center justify-between">
          <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest font-bold">
            DIRECTORY // PAGE {page} OF {totalPages}
          </span>
          {isLoading && (
            <span className="font-mono text-[9px] text-slate-700 uppercase tracking-widest animate-pulse">
              LOADING...
            </span>
          )}
        </div>

        {/* Loading state */}
        {isLoading && users.length === 0 && !error && (
          <PageLoading message="Synchronizing player directory..." />
        )}

        {/* Error state */}
        {error && (
          <ConnectionError onRetry={refetch} />
        )}

        {/* Empty state */}
        {!isLoading && !error && users.length === 0 && (
          <PageEmpty
            title="NO PLAYERS FOUND"
            description={debouncedSearch ? "No players match your search criteria." : "No players have registered on this platform yet."}
          />
        )}

        {/* Data table */}
        {!error && users.length > 0 && (
          <UserDirectoryTable users={users} pageOffset={pageOffset} />
        )}

        {/* Pagination controls */}
        {!error && totalPages > 1 && (
          <div className="border-t border-slate-800/60 px-4 py-3 flex items-center justify-between">
            <button
              id="users-prev-page"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-7 h-7 font-mono text-[10px] border transition-colors cursor-pointer ${
                      pageNum === page
                        ? "border-cyber-cyan text-cyber-cyan bg-cyber-cyan/5"
                        : "border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              id="users-next-page"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
