import React from "react";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./providers";
import { router } from "../routes/router";
import { useAuthStore } from "../stores/authStore";
import { useThemeStore } from "../stores/themeStore";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const initTheme = useThemeStore((state) => state.initTheme);

  React.useEffect(() => {
    initializeAuth();
    initTheme();
  }, [initializeAuth, initTheme]);

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
