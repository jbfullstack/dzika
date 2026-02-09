"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileAudio, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  accept: string;
  maxSize: number;
  value?: string;
  onChange: (url: string) => void;
  onFileInfo?: (info: { duration?: number; fileSize: number }) => void;
  type: "audio" | "image";
  label?: string;
}

export function FileUpload({
  accept,
  maxSize,
  value,
  onChange,
  onFileInfo,
  type,
  label,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(value || null);

  async function handleFile(file: File) {
    setError(null);

    if (file.size > maxSize) {
      setError(`File too large. Max ${Math.round(maxSize / 1024 / 1024)}MB`);
      return;
    }

    // Get audio duration if applicable
    if (type === "audio" && onFileInfo) {
      const duration = await getAudioDuration(file);
      onFileInfo({ duration: Math.round(duration), fileSize: file.size });
    } else if (onFileInfo) {
      onFileInfo({ fileSize: file.size });
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Upload failed");
        return;
      }

      const data = await res.json();
      onChange(data.url);
      if (type === "image") setPreview(data.url);
    } catch {
      setError("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clear() {
    onChange("");
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const Icon = type === "audio" ? FileAudio : ImageIcon;

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}

      {value && type === "image" && preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="h-32 w-32 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={clear}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : value && type === "audio" ? (
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
          <FileAudio className="h-4 w-4 text-white/40" />
          <span className="flex-1 truncate text-sm text-white/60">File uploaded</span>
          <button
            type="button"
            onClick={clear}
            className="text-white/40 hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/10 p-6 transition-colors hover:border-white/20",
            uploading && "pointer-events-none opacity-50"
          )}
        >
          {uploading ? (
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <Icon className="h-8 w-8 text-white/20" />
          )}
          <p className="text-sm text-white/40">
            {uploading
              ? "Uploading..."
              : `Drop ${type} file or click to browse`}
          </p>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(audio.src);
    };
    audio.onerror = () => resolve(0);
    audio.src = URL.createObjectURL(file);
  });
}
