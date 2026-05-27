"use client";

import { supabase } from "@/lib/supabase/client";

export type StorageBucket = "cylinder-images" | "damage-reports" | "delivery-proofs" | "receipts";

export async function compressImage(file: File, maxWidth = 1400, quality = 0.78) {
  if (!file.type.startsWith("image/")) return file;

  const image = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / image.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
}

export async function uploadImage(bucket: StorageBucket, file: File, folder = "uploads") {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add environment variables before uploading.");
  }

  const compressed = await compressImage(file);
  const path = `${folder}/${crypto.randomUUID()}-${compressed.name}`;
  const { error } = await supabase.storage.from(bucket).upload(path, compressed, {
    cacheControl: "3600",
    upsert: true
  });

  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
}

export async function deleteImage(bucket: StorageBucket, path: string) {
  if (!supabase) return;
  await supabase.storage.from(bucket).remove([path]);
}
