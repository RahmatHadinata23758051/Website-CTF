export interface AdminSubmissionUser {
  id: string;
  name: string;
  email: string;
}

export interface AdminSubmissionChallenge {
  id: string;
  title: string;
  slug: string;
  category: string;
  points: number;
}

export interface AdminSubmission {
  id: string;
  user: AdminSubmissionUser;
  challenge: AdminSubmissionChallenge;
  is_correct: boolean;
  submitted_flag_redacted: string;
  created_at: string;
}

export interface AdminSolve {
  id: string;
  user: AdminSubmissionUser;
  challenge: AdminSubmissionChallenge;
  solved_at: string;
  created_at: string;
}

export interface TopWrongSubmitter {
  user_id: string;
  name: string;
  wrong_count: number;
}

export interface MostAttemptedChallenge {
  challenge_id: string;
  title: string;
  attempt_count: number;
}

export interface AdminSubmissionStats {
  total_submissions: number;
  correct_submissions: number;
  wrong_submissions: number;
  total_solves: number;
  unique_submitters: number;
  top_wrong_submitters: TopWrongSubmitter[];
  most_attempted_challenges: MostAttemptedChallenge[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface SubmissionsListResponse {
  success: boolean;
  message: string;
  data: {
    submissions: AdminSubmission[];
    pagination: Pagination;
  };
}

export interface SolvesListResponse {
  success: boolean;
  message: string;
  data: {
    solves: AdminSolve[];
    pagination: Pagination;
  };
}

export interface SubmissionStatsResponse {
  success: boolean;
  message: string;
  data: AdminSubmissionStats;
}
