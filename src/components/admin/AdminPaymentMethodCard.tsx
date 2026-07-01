"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import type { PaymentMethod } from "@/types";

function Field({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm"
      />
    </label>
  );
}

export function AdminPaymentMethodCard({
  method,
  onUpdate,
  onToggleEnabled,
  onLabelChange,
}: {
  method: PaymentMethod;
  onUpdate: (field: string, value: string) => void;
  onToggleEnabled: (enabled: boolean) => void;
  onLabelChange: (label: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  async function uploadQr(file: File) {
    setUploading(true);
    setUploadMsg("");
    const form = new FormData();
    form.append("file", file);
    form.append("methodId", method.id);
    const res = await fetch("/api/admin/upload-qr", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (res.ok && data.url) {
      onUpdate("qrCodeUrl", data.url);
      setUploadMsg("QR uploaded.");
    } else {
      setUploadMsg(data.error ?? "Upload failed.");
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <input
          value={method.label}
          onChange={(e) => onLabelChange(e.target.value)}
          className="bg-transparent text-lg font-semibold outline-none"
        />
        <label className="flex shrink-0 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={method.enabled}
            onChange={(e) => onToggleEnabled(e.target.checked)}
          />
          Enabled
        </label>
      </div>

      {method.id === "bank_transfer" && (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Bank name" value={method.details.bankName ?? ""} onChange={(v) => onUpdate("bankName", v)} />
          <Field label="Account name" value={method.details.accountName ?? ""} onChange={(v) => onUpdate("accountName", v)} />
          <Field label="Account number" value={method.details.accountNumber ?? ""} onChange={(v) => onUpdate("accountNumber", v)} />
          <Field label="Routing number" value={method.details.routingNumber ?? ""} onChange={(v) => onUpdate("routingNumber", v)} />
          <Field label="SWIFT / BIC" value={method.details.swiftCode ?? ""} onChange={(v) => onUpdate("swiftCode", v)} />
          <Field
            label="Instructions"
            value={method.details.instructions ?? ""}
            onChange={(v) => onUpdate("instructions", v)}
            className="md:col-span-2"
          />
        </div>
      )}

      {method.id === "crypto" && (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Coin / asset" value={method.details.coin ?? ""} onChange={(v) => onUpdate("coin", v)} placeholder="USDT, BTC, ETH" />
            <Field label="Network" value={method.details.network ?? ""} onChange={(v) => onUpdate("network", v)} placeholder="TRC20, ERC20, Bitcoin" />
            <Field
              label="Wallet address"
              value={method.details.walletAddress ?? ""}
              onChange={(v) => onUpdate("walletAddress", v)}
              className="md:col-span-2"
            />
            <Field
              label="QR code image URL (optional)"
              value={method.details.qrCodeUrl ?? ""}
              onChange={(v) => onUpdate("qrCodeUrl", v)}
              placeholder="/payment-qr/crypto.png or https://..."
              className="md:col-span-2"
            />
          </div>

          <div className="rounded-xl border border-dashed border-white/20 bg-slate-800/50 p-4">
            <p className="mb-2 text-sm text-slate-400">Upload QR code image</p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/15">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Choose image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadQr(file);
                }}
              />
            </label>
            {uploadMsg && <p className="mt-2 text-xs text-emerald-400">{uploadMsg}</p>}
            {method.details.qrCodeUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={method.details.qrCodeUrl}
                alt="QR preview"
                className="mt-3 h-32 w-32 rounded-lg border border-white/10 bg-white p-1"
              />
            )}
          </div>

          <Field
            label="Payment instructions"
            value={method.details.instructions ?? ""}
            onChange={(v) => onUpdate("instructions", v)}
            placeholder="Send exact amount and include order reference in memo."
          />
        </div>
      )}

      {method.id !== "bank_transfer" && method.id !== "crypto" && (
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(method.details).map(([key, val]) => (
            <Field
              key={key}
              label={key}
              value={String(val ?? "")}
              onChange={(v) => onUpdate(key, v)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
