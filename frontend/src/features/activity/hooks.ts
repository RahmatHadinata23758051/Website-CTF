import { useQuery } from "@tanstack/react-query";
import { getRecentSolves } from "./api";

/**
 * Hook to fetch recent solve activity feed.
 * Re-fetches every 30 seconds to show live activity updates.
 */
export function useRecentSolves(limit = 10) {
  return useQuery({
    queryKey: ["activity", "recent-solves", limit],
    queryFn: () => getRecentSolves(limit),
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds stale TTL
    refetchInterval: 60 * 1000, // Refresh every 60 seconds
  });
}
