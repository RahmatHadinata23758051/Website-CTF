import { useQuery } from "@tanstack/react-query";
import { getPublicUserProfile } from "./publicProfileApi";

/**
 * Hook to fetch a player's public-safe profile by ID.
 * Requires authentication + accepted rules (enforced by backend).
 * Returns 404 response for admin, banned, or missing users.
 */
export function usePublicUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["users", "public-profile", userId],
    queryFn: () => getPublicUserProfile(userId!),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000,
    retry: (failureCount, error: any) => {
      // Do not retry on 404 (user not found / hidden)
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}
