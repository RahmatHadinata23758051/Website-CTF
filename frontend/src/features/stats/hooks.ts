import { useQuery } from "@tanstack/react-query";
import { getOverviewStats } from "./api";

export function useOverviewStats() {
  return useQuery({
    queryKey: ["stats", "overview"],
    queryFn: getOverviewStats,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds stale TTL
  });
}
