export interface UpdateProfilePayload {
  name: string;
}

export interface ChangePasswordPayload {
  current_password:  string;
  new_password:      string;
  confirm_password:  string;
}

export interface AccountUser {
  id:         string;
  name:       string;
  email:      string;
  role:       string;
  accepted_rules_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AccountUserResponse {
  success: boolean;
  message: string;
  data: {
    user: AccountUser;
  };
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface AcceptRulesResponse {
  success: boolean;
  message: string;
  data: {
    accepted_rules_at: string;
  };
}
