import { api } from "../../lib/api";
import type { AuthResponse, MeResponse } from "./types";

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", { name, email, password });
  return response.data;
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await api.post<{ success: boolean; message: string }>("/auth/logout");
  return response.data;
}

export async function getMe(): Promise<MeResponse> {
  const response = await api.get<MeResponse>("/auth/me");
  return response.data;
}
