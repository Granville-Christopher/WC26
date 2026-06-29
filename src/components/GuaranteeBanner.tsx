import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function GuaranteeBanner() {
  return (
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-8 w-8 shrink-0 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-gray-900">CupVault Guarantee</h3>
            <p className="mt-1 text-sm text-gray-600">
              Valid tickets delivered on time — or replacement tickets / full refund. Every seller verified.
            </p>
          </div>
        </div>
        <Link
          href="/guarantee"
          className="shrink-0 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
