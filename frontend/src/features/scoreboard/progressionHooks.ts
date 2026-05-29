import { useQuery } from "@tanstack/react-query";
import { getScoreboardProgression } from "./progressionApi";

export function useScoreboardProgression() {
  return useQuery({
    queryKey: ["scoreboardProgression"],
    queryFn: getScoreboardProgression,
    refetchOnWindowFocus: false,
    staleTime: 15 * 1000, // 15 seconds stale TTL matching Redis cache TTL
  });
}
