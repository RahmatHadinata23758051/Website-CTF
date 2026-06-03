export interface DirectoryUser {
  id: string;
  name: string;
  rank: number | null;
  total_points: number;
  total_solves: number;
}

export interface UserDirectoryPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface UserDirectoryResponse {
  success: boolean;
  message: string;
  data: {
    users: DirectoryUser[];
    pagination: UserDirectoryPagination;
  } | null;
}

export interface UserDirectoryFilters {
  search?: string;
  page?: number;
  limit?: number;
}
