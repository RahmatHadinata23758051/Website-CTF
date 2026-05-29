import { api } from "../../../lib/api";

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    attachment_url: string;
    filename: string;
    size: number;
    content_type: string;
  } | null;
}

export async function uploadChallengeAttachment(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<UploadResponse>(
    "/admin/uploads/challenge-attachment",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const data = response.data.data;
  if (!data) {
    throw new Error(response.data.message || "Failed to upload challenge attachment");
  }

  return data.attachment_url;
}
