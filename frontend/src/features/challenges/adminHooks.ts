import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminChallenges,
  getAdminChallenge,
  createAdminChallenge,
  updateAdminChallenge,
  updateAdminChallengeStatus,
  deleteAdminChallenge,
} from "./adminApi";
import type { AdminChallengeRequest } from "./types";

export function useAdminChallenges() {
  return useQuery({
    queryKey: ["admin", "challenges"],
    queryFn: getAdminChallenges,
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000, // 10 seconds stale TTL
  });
}

export function useAdminChallenge(id: string | null) {
  return useQuery({
    queryKey: ["admin", "challenge", id],
    queryFn: () => (id ? getAdminChallenge(id) : null),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000,
  });
}

export function useCreateAdminChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminChallengeRequest) => createAdminChallenge(data),
    onSuccess: () => {
      // Invalidate both admin and public challenge caches
      queryClient.invalidateQueries({ queryKey: ["admin", "challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}

export function useUpdateAdminChallenge(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminChallengeRequest) => updateAdminChallenge(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "challenges"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "challenge", id] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenge", data.slug] });
    },
  });
}

export function useUpdateAdminChallengeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      updateAdminChallengeStatus(id, isActive),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "challenges"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "challenge", data.id] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenge", data.slug] });
    },
  });
}

export function useDeleteAdminChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdminChallenge(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}
