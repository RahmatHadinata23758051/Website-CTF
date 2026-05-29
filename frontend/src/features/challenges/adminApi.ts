import { api } from "../../lib/api";
import { mapUICategoryToBackend, mapBackendCategoryToUI } from "./api";
import type {
  AdminChallenge,
  AdminChallengeListResponse,
  AdminChallengeResponse,
  AdminChallengeRequest,
} from "./types";

export async function getAdminChallenges(): Promise<AdminChallenge[]> {
  const response = await api.get<AdminChallengeListResponse>("/admin/challenges");
  const challenges = response.data.data?.challenges || [];
  
  // Map categories back to standard UI terms for consistent presentation
  return challenges.map((ch) => ({
    ...ch,
    category: mapBackendCategoryToUI(ch.category),
  }));
}

export async function getAdminChallenge(id: string): Promise<AdminChallenge> {
  const response = await api.get<AdminChallengeResponse>(`/admin/challenges/${id}`);
  const challenge = response.data.data?.challenge;
  if (!challenge) {
    throw new Error("Challenge not found");
  }
  return {
    ...challenge,
    category: mapBackendCategoryToUI(challenge.category),
  };
}

export async function createAdminChallenge(data: AdminChallengeRequest): Promise<AdminChallenge> {
  // Map standard UI category (e.g. Web Exploitation) to short backend database value (e.g. Web)
  const payload = {
    ...data,
    category: mapUICategoryToBackend(data.category),
  };
  const response = await api.post<AdminChallengeResponse>("/admin/challenges", payload);
  const challenge = response.data.data?.challenge;
  if (!challenge) {
    throw new Error("Failed to create challenge");
  }
  return {
    ...challenge,
    category: mapBackendCategoryToUI(challenge.category),
  };
}

export async function updateAdminChallenge(
  id: string,
  data: AdminChallengeRequest
): Promise<AdminChallenge> {
  const payload = {
    ...data,
    category: mapUICategoryToBackend(data.category),
  };
  const response = await api.put<AdminChallengeResponse>(`/admin/challenges/${id}`, payload);
  const challenge = response.data.data?.challenge;
  if (!challenge) {
    throw new Error("Failed to update challenge");
  }
  return {
    ...challenge,
    category: mapBackendCategoryToUI(challenge.category),
  };
}

export async function updateAdminChallengeStatus(
  id: string,
  isActive: boolean
): Promise<{ id: string; title: string; slug: string; is_active: boolean }> {
  const response = await api.patch<{
    success: boolean;
    data: { id: string; title: string; slug: string; is_active: boolean } | null;
  }>(`/admin/challenges/${id}/status`, { is_active: isActive });
  const data = response.data.data;
  if (!data) {
    throw new Error("Failed to update challenge status");
  }
  return data;
}

export async function deleteAdminChallenge(id: string): Promise<void> {
  await api.delete(`/admin/challenges/${id}`);
}
