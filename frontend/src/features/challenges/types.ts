import type { Category, Difficulty } from "../../types";

export interface Challenge {
  id: string;
  title: string;
  slug: string;
  category: Category | string;
  difficulty: Difficulty;
  points: number;
  is_solved: boolean;
  description: string;
  solve_count?: number;
}

export interface ChallengeListResponse {
  success: boolean;
  message: string;
  data: {
    challenges: Challenge[];
  } | null;
}

export interface ChallengeFilters {
  search?: string;
  category?: string;
  difficulty?: string;
}

export interface ChallengeDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category | string;
  difficulty: Difficulty;
  points: number;
  attachment_url: string | null;
  external_link: string | null;
  is_solved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChallengeDetailResponse {
  success: boolean;
  message: string;
  data: {
    challenge: ChallengeDetail;
  } | null;
}

export interface FlagSubmitResponse {
  success: boolean;
  correct?: boolean;
  message: string;
  data: {
    points: number;
    already_solved: boolean;
  } | null;
}
