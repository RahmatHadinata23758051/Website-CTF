import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listUsers,
  updateUserRole,
  banUser,
  unbanUser,
} from "./api";
import type { ListUsersParams } from "./api";
import type { UpdateRolePayload, BanUserPayload } from "./types";

export function useAdminUsers(filters?: ListUsersParams) {
  return useQuery({
    queryKey: ["adminUsers", filters],
    queryFn: () => listUsers(filters),
    refetchOnWindowFocus: false,
    staleTime: 10 * 1000, // 10 seconds stale TTL
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      updateUserRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: BanUserPayload }) =>
      banUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
  });
}
