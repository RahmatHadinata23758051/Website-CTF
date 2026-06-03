// Public profile types — strictly no email, role, password, ban fields

export interface PublicProfileUser {
  id: string;
  name: string;
  created_at: string;
}

export interface PublicProfileStats {
  rank: number | null;
  total_points: number;
  total_solves: number;
  total_categories_solved: number;
}

export interface PublicSolvedChallenge {
  challenge_id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  points: number;
  solved_at: string;
}

export interface PublicCategoryBreakdown {
  category: string;
  solves: number;
  points: number;
}

export interface PublicProfileData {
  user: PublicProfileUser;
  stats: PublicProfileStats;
  recent_solves: PublicSolvedChallenge[];
  solved_challenges: PublicSolvedChallenge[];
  category_breakdown: PublicCategoryBreakdown[];
}

export interface PublicProfileResponse {
  success: boolean;
  message: string;
  data: PublicProfileData;
}
