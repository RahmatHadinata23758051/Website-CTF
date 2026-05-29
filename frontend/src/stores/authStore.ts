import { create } from "zustand";
import type { User } from "../features/auth/types";
import { api } from "../lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("ctf_token"),
  isAuthenticated: false,
  isLoading: true,

  setAuth: (token: string, user: User) => {
    localStorage.setItem("ctf_token", token);
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    localStorage.removeItem("ctf_token");
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem("ctf_token");
    if (!token) {
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      // Direct call using axios instance to retrieve authenticated user details
      const response = await api.get("/auth/me");
      if (response.data && response.data.success && response.data.data?.user) {
        set({
          user: response.data.data.user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        localStorage.removeItem("ctf_token");
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      localStorage.removeItem("ctf_token");
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
