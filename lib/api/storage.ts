import apiClient from "./client";

export async function uploadFile(file: File, folder = "uploads"): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const { data } = await apiClient.post<{ url: string }>(
    "/upload",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data.url;
}

export async function deleteFile(_url: string): Promise<void> {
  // Local file deletion not implemented
}
