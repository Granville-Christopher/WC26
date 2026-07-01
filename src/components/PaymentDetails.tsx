"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import type { PaymentMethod } from "@/types";
import { getPaymentQrUrl, isBankMethod, isCryptoMethod } from "@/lib/payment-display";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <div className="mt-1 flex items-start justify-between gap-2">
        <p className="break-all font-mono text-sm text-slate-900">{value}</p>
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-[#003087]"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value?.trim()) return null;
  return (
    <p className="text-sm text-slate-700">
      <span className="font-medium text-slate-500">{label}: </span>
      {value}
    </p>
  );
}

export function PaymentDetails({
  method,
  compact = false,
}: {
  method: PaymentMethod;
  compact?: boolean;
}) {
  const d = method.details;
  const qrUrl = getPaymentQrUrl(method);

  if (isCryptoMethod(method)) {
    return (
      <div className={`space-y-4 ${compact ? "" : "rounded-xl border border-slate-200 bg-slate-50 p-5"}`}>
        <div>
          <h3 className="font-semibold text-slate-900">{method.label}</h3>
          {d.coin && <p className="mt-0.5 text-sm text-slate-500">Accepting: {d.coin}</p>}
        </div>
        <DetailRow label="Network" value={d.network} />
        {d.walletAddress ? (
          <CopyField label="Wallet address" value={d.walletAddress} />
        ) : (
          <p className="text-sm text-amber-700">Wallet address will be provided after order confirmation.</p>
        )}
        {qrUrl && (
          <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scan to pay</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="Crypto payment QR code" className="h-48 w-48 rounded-lg" />
          </div>
        )}
        {d.instructions && (
          <p className="rounded-lg bg-blue-50 p-3 text-sm text-slate-700">{d.instructions}</p>
        )}
      </div>
    );
  }

  if (isBankMethod(method)) {
    return (
      <div className={`space-y-3 ${compact ? "" : "rounded-xl border border-slate-200 bg-slate-50 p-5"}`}>
        <h3 className="font-semibold text-slate-900">{method.label}</h3>
        <DetailRow label="Bank" value={d.bankName} />
        <DetailRow label="Account name" value={d.accountName} />
        {d.accountNumber && <CopyField label="Account number" value={d.accountNumber} />}
        {d.routingNumber && <CopyField label="Routing number" value={d.routingNumber} />}
        <DetailRow label="SWIFT / BIC" value={d.swiftCode} />
        {d.instructions && (
          <p className="rounded-lg bg-blue-50 p-3 text-sm text-slate-700">{d.instructions}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${compact ? "" : "rounded-xl border border-slate-200 bg-slate-50 p-5"}`}>
      <h3 className="font-semibold text-slate-900">{method.label}</h3>
      {Object.entries(d).map(([key, val]) =>
        val ? (
          <p key={key} className="text-sm text-slate-700">
            <span className="capitalize text-slate-500">
              {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
            </span>
            {String(val)}
          </p>
        ) : null
      )}
    </div>
  );
}
