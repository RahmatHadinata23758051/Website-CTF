export interface CategoryStats {
  name: string;
  challenge_count: number;
}

export interface OverviewStats {
  total_challenges: number;
  total_categories: number;
  total_players: number;
  total_solves: number;
  active_challenges: number;
  scoreboard_entries: number;
  categories: CategoryStats[];
}

export interface OverviewStatsResponse {
  success: boolean;
  message: string;
  data: OverviewStats | null;
}
