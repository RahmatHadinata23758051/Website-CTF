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
  solve_count: number;
  scoring_type: string;
  initial_points: number;
  minimum_points: number;
  decay: number;
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
  solve_count: number;
  attachment_url: string | null;
  external_link: string | null;
  is_solved: boolean;
  scoring_type: string;
  initial_points: number;
  minimum_points: number;
  decay: number;
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

export interface AdminChallenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  attachment_url: string | null;
  external_link: string | null;
  is_active: boolean;
  scoring_type: string;
  initial_points: number;
  minimum_points: number;
  decay: number;
  solve_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdminChallengeListResponse {
  success: boolean;
  message: string;
  data: {
    challenges: AdminChallenge[];
  } | null;
}

export interface AdminChallengeResponse {
  success: boolean;
  message: string;
  data: {
    challenge: AdminChallenge;
  } | null;
}

export interface AdminChallengeRequest {
  title: string;
  slug?: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  flag?: string; // Plaintext flag (optional on update, required on create)
  attachment_url: string | null;
  external_link: string | null;
  is_active: boolean;
  scoring_type: string;
  initial_points: number;
  minimum_points: number;
  decay: number;
}

