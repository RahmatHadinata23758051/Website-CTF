import { api } from "../../lib/api";
import type { RecentSolvesResponse } from "./types";

/**
 * Fetches the recent solve activity feed.
 * Requires authentication — the api client attaches the JWT automatically.
 */
export async function getRecentSolves(limit = 10): Promise<RecentSolvesResponse> {
  const res = await api.get<RecentSolvesResponse>(`/activity/recent-solves?limit=${limit}`);
  return res.data;
}
