import { api } from "../../lib/api";
import type { OverviewStatsResponse } from "./types";

export async function getOverviewStats(): Promise<OverviewStatsResponse> {
  const response = await api.get<OverviewStatsResponse>("/stats/overview");
  return response.data;
}
