import { api } from "../../lib/api";
import type { ProfileSummaryResponse } from "./types";

export async function getProfileSummary(): Promise<ProfileSummaryResponse> {
  const response = await api.get<ProfileSummaryResponse>("/profile/summary");
  return response.data;
}
