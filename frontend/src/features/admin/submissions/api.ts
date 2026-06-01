import { api } from "../../../lib/api";
import type {
  SubmissionsListResponse,
  SolvesListResponse,
  SubmissionStatsResponse,
} from "./types";

export interface ListSubmissionsParams {
  search?: string;
  user_id?: string;
  challenge_id?: string;
  correct?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface ListSolvesParams {
  search?: string;
  user_id?: string;
  challenge_id?: string;
  category?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export async function listSubmissions(params?: ListSubmissionsParams): Promise<SubmissionsListResponse> {
  const response = await api.get<SubmissionsListResponse>("/admin/submissions", { params });
  return response.data;
}

export async function listSolves(params?: ListSolvesParams): Promise<SolvesListResponse> {
  const response = await api.get<SolvesListResponse>("/admin/solves", { params });
  return response.data;
}

export async function getSubmissionStats(): Promise<SubmissionStatsResponse> {
  const response = await api.get<SubmissionStatsResponse>("/admin/submissions/stats");
  return response.data;
}
