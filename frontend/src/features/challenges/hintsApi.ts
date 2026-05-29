import { api } from "../../lib/api";
import type { Hint, HintListResponse, HintResponse, AdminHintRequest } from "./hintsTypes";

// === PUBLIC HINTS API ===

export async function getPublicHints(slug: string): Promise<Hint[]> {
  const response = await api.get<HintListResponse>(`/challenges/${slug}/hints`);
  return response.data.data?.hints || [];
}

// === ADMIN HINTS API ===

export async function getAdminHints(challengeID: string): Promise<Hint[]> {
  const response = await api.get<HintListResponse>(`/admin/challenges/${challengeID}/hints`);
  return response.data.data?.hints || [];
}

export async function createHint(challengeID: string, data: AdminHintRequest): Promise<Hint> {
  const response = await api.post<HintResponse>(`/admin/challenges/${challengeID}/hints`, data);
  const hint = response.data.data?.hint;
  if (!hint) {
    throw new Error(response.data.message || "Failed to create hint");
  }
  return hint;
}

export async function updateHint(id: string, data: AdminHintRequest): Promise<Hint> {
  const response = await api.put<HintResponse>(`/admin/hints/${id}`, data);
  const hint = response.data.data?.hint;
  if (!hint) {
    throw new Error(response.data.message || "Failed to update hint");
  }
  return hint;
}

export async function updateHintStatus(id: string, isActive: boolean): Promise<Hint> {
  const response = await api.patch<HintResponse>(`/admin/hints/${id}/status`, { is_active: isActive });
  const hint = response.data.data?.hint;
  if (!hint) {
    throw new Error(response.data.message || "Failed to update hint status");
  }
  return hint;
}

export async function deleteHint(id: string): Promise<void> {
  await api.delete(`/admin/hints/${id}`);
}
