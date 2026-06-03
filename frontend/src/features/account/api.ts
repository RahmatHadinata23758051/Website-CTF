import { api } from "../../lib/api";
import type { 
  UpdateProfilePayload, 
  ChangePasswordPayload, 
  AccountUserResponse, 
  ChangePasswordResponse,
  AcceptRulesResponse
} from "./types";

export async function updateProfile(payload: UpdateProfilePayload): Promise<AccountUserResponse> {
  const response = await api.patch<AccountUserResponse>("/account/profile", payload);
  return response.data;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<ChangePasswordResponse> {
  const response = await api.patch<ChangePasswordResponse>("/account/password", payload);
  return response.data;
}

export async function acceptRules(): Promise<AcceptRulesResponse> {
  const response = await api.post<AcceptRulesResponse>("/account/accept-rules");
  return response.data;
}
