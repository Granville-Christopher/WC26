"use client";

import { useRef, useState } from "react";
import { FileUp, Loader2, CheckCircle, X } from "lucide-react";
import { safeJson } from "@/lib/utils";
import type { PaymentProof } from "@/types";

function isImageType(contentType: string) {
  return contentType.startsWith("image/");
}

export function ProofOfPaymentField({
  orderRef,
  existingProof,
  onUploaded,
  compact = false,
}: {
  orderRef?: string;
  existingProof?: PaymentProof;
  onUploaded?: (proof: PaymentProof) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [proof, setProof] = useState<PaymentProof | undefined>(existingProof);

  function clearFile() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleFileSelect(selected: File | null) {
    clearFile();
    if (!selected) return;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowed.includes(selected.type)) {
      setError("Please upload an image (JPG, PNG, WebP, GIF) or PDF.");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError("File must be 10 MB or smaller.");
      return;
    }

    setError("");
    setFile(selected);
    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    }
  }

  async function uploadProof(targetOrderRef: string) {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("orderRef", targetOrderRef);
      form.append("file", file);

      const res = await fetch("/api/checkout/proof", { method: "POST", body: form });
      const data = await safeJson<{ error?: string; proof?: PaymentProof }>(res);

      if (!res.ok || !data.proof) {
        setError(data.error ?? `Upload failed (${res.status}). Please try again.`);
        return;
      }

      setProof(data.proof);
      clearFile();
      onUploaded?.(data.proof);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  if (proof) {
    return (
      <div className={`rounded-xl border border-emerald-200 bg-emerald-50 p-4 ${compact ? "" : "mt-4"}`}>
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-emerald-900">Proof of payment uploaded</p>
            <p className="mt-1 truncate text-sm text-emerald-800">{proof.filename}</p>
            {isImageType(proof.contentType) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={proof.url}
                alt="Payment proof"
                className="mt-3 max-h-48 rounded-lg border border-emerald-200 bg-white object-contain"
              />
            )}
            {!isImageType(proof.contentType) && (
              <a
                href={proof.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-emerald-700 underline"
              >
                View uploaded file
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 ${compact ? "" : "mt-4"}`}>
      <p className="text-sm font-semibold text-slate-900">Proof of payment</p>
      <p className="mt-1 text-xs text-slate-500">
        Upload a screenshot or receipt after you send payment (image or PDF, max 10 MB).
      </p>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <FileUp className="h-4 w-4" />
          Choose file
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
        </label>
        {file && (
          <>
            <span className="max-w-[200px] truncate text-sm text-slate-600">{file.name}</span>
            <button
              type="button"
              onClick={clearFile}
              className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Preview" className="mt-3 max-h-40 rounded-lg border border-slate-200 bg-white object-contain" />
      )}

      {orderRef && file && (
        <button
          type="button"
          onClick={() => uploadProof(orderRef)}
          disabled={uploading}
          className="mt-4 flex items-center gap-2 rounded-lg bg-[#003087] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00266b] disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
          Upload proof
        </button>
      )}
    </div>
  );
}

/** Hidden file field for checkout submit — parent reads via ref or passes file state */
export function ProofOfPaymentInput({
  file,
  onFileChange,
}: {
  file: File | null;
  onFileChange: (file: File | null) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSelect(selected: File | null) {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);

    if (!selected) {
      onFileChange(null);
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowed.includes(selected.type) || selected.size > 10 * 1024 * 1024) {
      onFileChange(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    onFileChange(selected);
    if (selected.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selected));
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">Proof of payment</p>
      <p className="mt-1 text-xs text-slate-500">
        Upload your transfer receipt or transaction screenshot (image or PDF).
      </p>
      <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
        <FileUp className="h-4 w-4" />
        {file ? "Change file" : "Choose file"}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          className="hidden"
          onChange={(e) => handleSelect(e.target.files?.[0] ?? null)}
        />
      </label>
      {file && <p className="mt-2 text-sm text-slate-600">{file.name}</p>}
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Preview" className="mt-3 max-h-40 rounded-lg border border-slate-200 object-contain" />
      )}
    </div>
  );
}

export async function uploadProofForOrder(orderRef: string, file: File): Promise<PaymentProof | null> {
  try {
    const form = new FormData();
    form.append("orderRef", orderRef);
    form.append("file", file);
    const res = await fetch("/api/checkout/proof", { method: "POST", body: form });
    if (!res.ok) return null;
    const data = await safeJson<{ proof?: PaymentProof }>(res);
    return data.proof ?? null;
  } catch {
    return null;
  }
}
