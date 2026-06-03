import { api } from "../../lib/api";
import type { PublicProfileResponse } from "./publicProfileTypes";

/**
 * Fetches the public-safe profile for a specific player by ID.
 * Requires authentication + accepted rules.
 * Returns 404 for admin users, banned users, and missing users.
 */
export async function getPublicUserProfile(userId: string): Promise<PublicProfileResponse> {
  const res = await api.get<PublicProfileResponse>(`/users/${userId}/profile`);
  return res.data;
}
