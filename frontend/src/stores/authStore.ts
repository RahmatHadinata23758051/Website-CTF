import { create } from "zustand";
import axios from "axios";
import type { User } from "../features/auth/types";

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
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
      // Call using raw axios to avoid circular dependency with api client
      const response = await axios.get(`${baseURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
