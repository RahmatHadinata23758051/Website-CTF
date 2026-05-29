import { api } from "../../lib/api";
import type { ScoreboardProgressionResponse } from "./progressionTypes";

export async function getScoreboardProgression(): Promise<ScoreboardProgressionResponse> {
  const response = await api.get<ScoreboardProgressionResponse>("/scoreboard/progression");
  return response.data;
}
