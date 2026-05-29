import { api } from "../../lib/api";
import type { ChallengeFilters, ChallengeListResponse, ChallengeDetailResponse, FlagSubmitResponse } from "./types";

/**
 * Maps standard high-fidelity UI category names to backend database seeded values.
 */
export function mapUICategoryToBackend(category: string): string {
  switch (category) {
    case "Web Exploitation":
      return "Web";
    case "Reverse Engineering":
      return "Reverse";
    case "Cryptography":
      return "Crypto";
    case "Miscellaneous":
      return "Misc";
    default:
      return category; // Pwn, OSINT, Forensics, Steganography
  }
}

/**
 * Maps backend database category values back to high-fidelity UI naming conventions.
 */
export function mapBackendCategoryToUI(category: string): string {
  switch (category) {
    case "Web":
      return "Web Exploitation";
    case "Reverse":
      return "Reverse Engineering";
    case "Crypto":
      return "Cryptography";
    case "Misc":
      return "Miscellaneous";
    default:
      return category;
  }
}

export async function getChallenges(filters?: ChallengeFilters): Promise<ChallengeListResponse> {
  const params: Record<string, string> = {};

  if (filters?.search) {
    params.search = filters.search;
  }

  if (filters?.category && filters.category !== "All") {
    params.category = mapUICategoryToBackend(filters.category);
  }

  if (filters?.difficulty && filters.difficulty !== "All") {
    params.difficulty = filters.difficulty;
  }

  const response = await api.get<ChallengeListResponse>("/challenges", { params });
  return response.data;
}

export async function getChallengeDetail(slug: string): Promise<ChallengeDetailResponse> {
  const response = await api.get<ChallengeDetailResponse>(`/challenges/${slug}`);
  return response.data;
}

export async function submitFlag(slug: string, flag: string): Promise<FlagSubmitResponse> {
  const response = await api.post<FlagSubmitResponse>(`/challenges/${slug}/submit`, { flag });
  return response.data;
}
