import { useQuery } from "@tanstack/react-query";
import { getUsers } from "./api";
import type { UserDirectoryFilters } from "./types";

/**
 * Hook to fetch public user directory entries.
 * Re-fetches on filter changes; 30s stale TTL.
 */
export function useUserDirectory(filters?: UserDirectoryFilters) {
  return useQuery({
    queryKey: ["users", "directory", filters],
    queryFn: () => getUsers(filters),
    refetchOnWindowFocus: false,
    staleTime: 30 * 1000,
  });
}
