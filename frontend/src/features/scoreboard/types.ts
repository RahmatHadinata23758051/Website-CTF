export interface ScoreboardUser {
  rank: number;
  user_id: string;
  name: string;
  total_points: number;
  total_solves: number;
  last_solve_time: string | null;
}

export interface ScoreboardResponse {
  success: boolean;
  message: string;
  data: {
    scoreboard: ScoreboardUser[];
  } | null;
}
