import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadImage } from "../../lib/uploadImage";

interface ImageUploadFieldProps {
  label: string;
  folder: string;
  value: string | null | undefined;
  onChange: (url: string) => void;
  shape?: "square" | "wide";
}

export function ImageUploadField({ label, folder, value, onChange, shape = "square" }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <span className="block text-sm font-medium text-brand-navy">{label}</span>
      <div className="mt-1.5 flex items-center gap-4">
        <div
          className={`overflow-hidden rounded-sm bg-brand-gray-100 ${
            shape === "square" ? "h-20 w-20" : "h-16 w-32"
          }`}
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-brand-gray-400">
              No image
            </div>
          )}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-brand-gray-300 px-3 py-2 text-sm font-medium text-brand-navy hover:bg-brand-gray-100">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Upload className="h-4 w-4" aria-hidden="true" />}
          {isUploading ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={isUploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      </div>
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
