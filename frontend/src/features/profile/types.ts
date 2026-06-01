
export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface ProfileStats {
  rank: number | null;
  total_points: number;
  total_solves: number;
  total_categories_solved: number;
}

export interface SolvedChallenge {
  challenge_id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  points: number;
  solved_at: string;
}

export interface CategoryBreakdown {
  category: string;
  solves: number;
  points: number;
}

export interface ProfileSummary {
  user: ProfileUser;
  stats: ProfileStats;
  recent_solves: SolvedChallenge[];
  solved_challenges: SolvedChallenge[];
  category_breakdown: CategoryBreakdown[];
}

export interface ProfileSummaryResponse {
  success: boolean;
  message: string;
  data: ProfileSummary;
}
