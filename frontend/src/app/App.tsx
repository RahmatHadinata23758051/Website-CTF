import React from "react";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./providers";
import { router } from "../routes/router";
import { useAuthStore } from "../stores/authStore";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
