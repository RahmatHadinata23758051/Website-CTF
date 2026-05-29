import { useQuery } from "@tanstack/react-query";
import { getScoreboard } from "./api";

export function useScoreboard() {
  return useQuery({
    queryKey: ["scoreboard"],
    queryFn: getScoreboard,
    refetchOnWindowFocus: false,
    staleTime: 15 * 1000, // 15 seconds stale TTL matching Redis cache TTL
  });
}
