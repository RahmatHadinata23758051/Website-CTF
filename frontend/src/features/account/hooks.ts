import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, changePassword } from "./api";
import { useAuthStore } from "../../stores/authStore";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      // Invalidate profile query to re-fetch latest data
      queryClient.invalidateQueries({ queryKey: ["profileSummary"] });

      // Synchronize updated user name immediately in global authStore state
      const { token, setAuth } = useAuthStore.getState();
      if (token && res?.success && res?.data?.user) {
        setAuth(token, res.data.user);
      }
    }
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword
  });
}
