export interface Hint {
  id: string;
  challenge_id: string;
  content: string;
  cost: number;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface HintListResponse {
  success: boolean;
  message: string;
  data: {
    hints: Hint[];
  } | null;
}

export interface HintResponse {
  success: boolean;
  message: string;
  data: {
    hint: Hint;
  } | null;
}

export interface AdminHintRequest {
  content: string;
  cost: number;
  order_index: number;
  is_active: boolean;
}
