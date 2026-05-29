import axios from "axios";

// 1. Fetch backend API base URL from Vite environment, defaulting to standard dev port
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// 2. Instantiate global API client
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// 3. Request interceptor to dynamically inject Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ctf_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Response interceptor to catch unauthorized 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("ctf_token");
      // Use dynamic import to prevent circular dependency imports at build-time
      import("../stores/authStore").then(({ useAuthStore }) => {
        useAuthStore.getState().clearAuth();
      }).catch(() => {});
    }
    return Promise.reject(error);
  }
);
