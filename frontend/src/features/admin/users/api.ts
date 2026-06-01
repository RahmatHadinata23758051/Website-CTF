import { api } from "../../../lib/api";
import type {
  UsersListResponse,
  UserDetailResponse,
  UpdateRolePayload,
  BanUserPayload,
} from "./types";

export interface ListUsersParams {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function listUsers(params?: ListUsersParams): Promise<UsersListResponse> {
  const response = await api.get<UsersListResponse>("/admin/users", { params });
  return response.data;
}

export async function getUserDetail(id: string): Promise<UserDetailResponse> {
  const response = await api.get<UserDetailResponse>(`/admin/users/${id}`);
  return response.data;
}

export async function updateUserRole(id: string, payload: UpdateRolePayload): Promise<UserDetailResponse> {
  const response = await api.patch<UserDetailResponse>(`/admin/users/${id}/role`, payload);
  return response.data;
}

export async function banUser(id: string, payload: BanUserPayload): Promise<UserDetailResponse> {
  const response = await api.patch<UserDetailResponse>(`/admin/users/${id}/ban`, payload);
  return response.data;
}

export async function unbanUser(id: string): Promise<UserDetailResponse> {
  const response = await api.patch<UserDetailResponse>(`/admin/users/${id}/unban`);
  return response.data;
}
