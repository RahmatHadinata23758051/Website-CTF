export interface SolveSeriesPoint {
  timestamp: string;
  points: number;
}

export interface PlayerProgression {
  user_id: string;
  name: string;
  rank: number;
  total_points: number;
  total_solves: number;
  series: SolveSeriesPoint[];
}

export interface ScoreboardProgressionResponse {
  success: boolean;
  message: string;
  data: {
    players: PlayerProgression[];
  } | null;
}
