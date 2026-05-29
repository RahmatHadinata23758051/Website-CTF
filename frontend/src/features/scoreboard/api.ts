import { api } from "../../lib/api";
import type { ScoreboardResponse } from "./types";

export async function getScoreboard(): Promise<ScoreboardResponse> {
  const response = await api.get<ScoreboardResponse>("/scoreboard");
  return response.data;
}
