import { useMutation } from "@tanstack/react-query";
import { uploadChallengeAttachment } from "./api";

export function useUploadChallengeAttachment() {
  return useMutation({
    mutationFn: (file: File) => uploadChallengeAttachment(file),
  });
}
