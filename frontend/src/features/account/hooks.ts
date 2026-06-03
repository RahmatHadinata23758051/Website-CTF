import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, changePassword, acceptRules } from "./api";
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

export function useAcceptRules() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptRules,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["profileSummary"] });
      
      const { user, token, setAuth } = useAuthStore.getState();
      if (token && user && res?.success && res?.data?.accepted_rules_at) {
        const updatedUser = {
          ...user,
          accepted_rules_at: res.data.accepted_rules_at
        };
        setAuth(token, updatedUser);
      }
    }
  });
}
