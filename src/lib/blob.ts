import { put, del } from "@vercel/blob";

export async function uploadFile(
  file: File,
  pathname: string
): Promise<string> {
  const blob = await put(pathname, file, {
    access: "public",
  });
  return blob.url;
}

export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // Silently fail if file doesn't exist
  }
}
