"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  onChange: (urls: string[]) => void;
  uploadEndpoint: string;
  /** Which key to pick from the returned `urls` object. Default: "md" */
  urlKey?: string;
  maxImages?: number;
  label?: string;
}

export default function ImageUpload({
  images,
  onChange,
  uploadEndpoint,
  urlKey = "md",
  maxImages,
  label = "Images",
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(uploadEndpoint, { method: "POST", body: fd });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Upload failed (${res.status})`);
      }
      const data = (await res.json()) as { urls: Record<string, string> };
      const url = data.urls[urlKey];
      if (!url) throw new Error("No URL returned from server");
      onChange([...images, url]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete(url: string) {
    onChange(images.filter((u) => u !== url));
    // best-effort S3 cleanup — don't block UI
    fetch("/api/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }).catch(() => undefined);
  }

  const canAdd = maxImages === undefined || images.length < maxImages;

  return (
    <div>
      <p
        className="text-xs tracking-[0.12em] uppercase mb-2"
        style={{ color: "var(--color-fg-muted)" }}
      >
        {label}
      </p>

      <div className="flex flex-wrap gap-3 mb-2">
        {images.map((url) => (
          <div key={url} className="relative group">
            <div
              className="rounded-sm overflow-hidden"
              style={{
                width: 80,
                height: 100,
                border: "1px solid var(--color-card-border)",
                backgroundColor: "var(--color-dark-forest)",
              }}
            >
              <Image
                src={url}
                alt=""
                width={80}
                height={100}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={() => handleDelete(url)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
              style={{ backgroundColor: "#ff8a8a", color: "#000", lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        ))}

        {canAdd && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-sm flex flex-col items-center justify-center gap-1.5 text-xs transition-colors"
            style={{
              width: 80,
              height: 100,
              border: "1px dashed var(--color-card-border)",
              color: uploading ? "var(--color-fg-disabled)" : "var(--color-fg-tertiary)",
              backgroundColor: "var(--color-dark-forest)",
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? (
              <span style={{ fontSize: 18 }}>…</span>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <span>Upload</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && (
        <p className="text-xs mt-1" style={{ color: "#ff8a8a" }}>
          {error}
        </p>
      )}
    </div>
  );
}
