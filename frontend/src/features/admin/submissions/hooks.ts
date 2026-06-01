import { useQuery } from "@tanstack/react-query";
import {
  listSubmissions,
  listSolves,
  getSubmissionStats,
} from "./api";
import type { ListSubmissionsParams, ListSolvesParams } from "./api";

export function useAdminSubmissions(filters?: ListSubmissionsParams) {
  return useQuery({
    queryKey: ["adminSubmissions", filters],
    queryFn: () => listSubmissions(filters),
    refetchOnWindowFocus: false,
    staleTime: 5 * 1000, // 5 seconds stale TTL
  });
}

export function useAdminSolves(filters?: ListSolvesParams) {
  return useQuery({
    queryKey: ["adminSolves", filters],
    queryFn: () => listSolves(filters),
    refetchOnWindowFocus: false,
    staleTime: 5 * 1000, // 5 seconds stale TTL
  });
}

export function useAdminSubmissionStats() {
  return useQuery({
    queryKey: ["adminSubmissionStats"],
    queryFn: () => getSubmissionStats(),
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000, // 10 seconds stale TTL
  });
}
