export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  is_banned: boolean;
  banned_at: string | null;
  banned_reason: string | null;
  total_points: number;
  total_solves: number;
  created_at: string;
  updated_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
    pagination: Pagination;
  };
}

export interface UserDetailResponse {
  success: boolean;
  message: string;
  data: {
    user: AdminUser;
  };
}

export interface UpdateRolePayload {
  role: 'user' | 'admin';
}

export interface BanUserPayload {
  reason: string;
}
