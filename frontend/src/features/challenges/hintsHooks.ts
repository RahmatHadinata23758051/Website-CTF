import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPublicHints,
  getAdminHints,
  createHint,
  updateHint,
  updateHintStatus,
  deleteHint,
} from "./hintsApi";
import type { AdminHintRequest } from "./hintsTypes";

// === PUBLIC HINTS HOOK ===

export function usePublicHints(slug: string) {
  return useQuery({
    queryKey: ["challenge", slug, "hints"],
    queryFn: () => getPublicHints(slug),
    enabled: !!slug,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 60 seconds stale TTL
  });
}

// === ADMIN HINTS HOOKS ===

export function useAdminHints(challengeID: string | null) {
  return useQuery({
    queryKey: ["admin", "challenge", challengeID, "hints"],
    queryFn: () => (challengeID ? getAdminHints(challengeID) : []),
    enabled: !!challengeID,
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000,
  });
}

export function useCreateHint(challengeID: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminHintRequest) => createHint(challengeID, data),
    onSuccess: () => {
      // Invalidate both admin and public queries for hints
      queryClient.invalidateQueries({ queryKey: ["admin", "challenge", challengeID, "hints"] });
      queryClient.invalidateQueries({ queryKey: ["challenge"] }); // Invalidate all public challenge details caches
    },
  });
}

export function useUpdateHint(challengeID: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminHintRequest }) => updateHint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "challenge", challengeID, "hints"] });
      queryClient.invalidateQueries({ queryKey: ["challenge"] });
    },
  });
}

export function useUpdateHintStatus(challengeID: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => updateHintStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "challenge", challengeID, "hints"] });
      queryClient.invalidateQueries({ queryKey: ["challenge"] });
    },
  });
}

export function useDeleteHint(challengeID: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "challenge", challengeID, "hints"] });
      queryClient.invalidateQueries({ queryKey: ["challenge"] });
    },
  });
}
