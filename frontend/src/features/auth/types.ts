export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  accepted_rules_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData | null;
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  } | null;
}
