import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function FifaTrustStrip() {
  return (
    <section className="border-b border-slate-200 bg-[#f4f5f7] py-6">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-900">
              Don&apos;t risk unofficial sources or leave tickets to chance!
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <ShieldCheck className="h-4 w-4 text-[#003087]" />
              Secure your place with ticket-inclusive hospitality packages — Official Hospitality
              Provider of FIFA World Cup 2026™.
            </p>
          </div>
          <p className="text-xs text-slate-500 md:max-w-xs md:text-right">
            Up to six (6) packages per order. To purchase more, call{" "}
            <a href="tel:+18446521685" className="font-semibold text-[#003087]">
              +1-844-652-1685
            </a>
            . Seats not guaranteed to be together.
          </p>
        </div>
      </div>
    </section>
  );
}
