import { api } from "../../lib/api";
import type { UserDirectoryFilters, UserDirectoryResponse } from "./types";

/**
 * Fetches the public user directory with optional search and pagination.
 * Requires authentication.
 */
export async function getUsers(filters?: UserDirectoryFilters): Promise<UserDirectoryResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.page) params.set("page", String(filters.page));
  if (filters?.limit) params.set("limit", String(filters.limit));

  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await api.get<UserDirectoryResponse>(`/users${query}`);
  return res.data;
}
