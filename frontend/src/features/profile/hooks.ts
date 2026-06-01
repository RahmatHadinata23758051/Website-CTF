import { useQuery } from "@tanstack/react-query";
import { getProfileSummary } from "./api";

export function useProfileSummary() {
  return useQuery({
    queryKey: ["profileSummary"],
    queryFn: getProfileSummary,
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000, // 10 seconds stale TTL
  });
}
