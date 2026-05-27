"use client";

import Image from "next/image";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { uploadImage, type StorageBucket } from "@/lib/supabase/storage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

type ImageUploaderProps = {
  label: string;
  bucket: StorageBucket;
  value?: string;
  onChange: (url: string) => void;
};

export function ImageUploader({ label, bucket, value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(value);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function handleFile(file?: File) {
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    if (!isSupabaseConfigured()) {
      toast.error("Preview ready. Add Supabase env vars to upload images.");
      return;
    }

    try {
      setBusy(true);
      const result = await uploadImage(bucket, file, bucket);
      onChange(result.publicUrl);
      setPreview(result.publicUrl);
      toast.success(`${label} uploaded`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-charcoal">{label}</span>
        {preview ? (
          <button
            type="button"
            className="rounded-md p-2 text-flame hover:bg-flame/10"
            onClick={() => {
              setPreview(undefined);
              onChange("");
            }}
            aria-label={`Remove ${label}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex min-h-36 w-full items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-white text-sm font-semibold text-petrol"
      >
        {preview ? (
          <Image src={preview} alt={label} fill sizes="280px" className="object-cover" unoptimized={preview.startsWith("blob:")} />
        ) : (
          <span className="flex flex-col items-center gap-2">
            {busy ? <UploadCloud className="h-6 w-6 animate-pulse" /> : <ImagePlus className="h-6 w-6" />}
            Tap to upload
          </span>
        )}
      </button>
      <input ref={inputRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => handleFile(event.target.files?.[0])} />
    </div>
  );
}
