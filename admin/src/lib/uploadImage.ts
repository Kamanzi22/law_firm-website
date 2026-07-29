import { supabase } from "./supabaseClient";

/**
 * Uploads a file to the shared `media` storage bucket under the given
 * folder (e.g. "team", "articles", "logos") and returns its public URL.
 */
export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured.");

  const ext = file.name.split(".").pop() ?? "png";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}
