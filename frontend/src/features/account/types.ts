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
