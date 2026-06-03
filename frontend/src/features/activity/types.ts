export interface ActivityUser {
  id: string;
  name: string;
}

export interface ActivityChallenge {
  id: string;
  title: string;
  slug: string;
  category: string;
  points: number;
}

export interface RecentSolveActivity {
  user: ActivityUser;
  challenge: ActivityChallenge;
  solved_at: string;
}

export interface RecentSolvesResponse {
  success: boolean;
  message: string;
  data: {
    activities: RecentSolveActivity[];
  } | null;
}
