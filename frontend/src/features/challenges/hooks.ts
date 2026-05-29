import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChallenges, getChallengeDetail, submitFlag } from "./api";
import type { ChallengeFilters } from "./types";

export function useChallenges(filters?: ChallengeFilters) {
  return useQuery({
    queryKey: ["challenges", filters],
    queryFn: () => getChallenges(filters),
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds stale TTL
  });
}

export function useChallengeDetail(slug: string) {
  return useQuery({
    queryKey: ["challenge", slug],
    queryFn: () => getChallengeDetail(slug),
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000, // 30 seconds stale TTL
  });
}

export function useSubmitFlag(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flag: string) => submitFlag(slug, flag),
    onSuccess: (response) => {
      if (response.success && response.correct) {
        // Securely invalidate active queries to force updates across lists and details
        queryClient.invalidateQueries({ queryKey: ["challenge", slug] });
        queryClient.invalidateQueries({ queryKey: ["challenges"] });
      }
    },
  });
}
