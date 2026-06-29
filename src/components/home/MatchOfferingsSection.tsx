import Link from "next/link";
import { MATCH_OFFERINGS } from "@/data/fifa-home";
import { formatPrice } from "@/lib/utils";

export function MatchOfferingsSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Match Offerings</h2>
          <p className="mt-2 text-slate-600">Every offering features premium seats and hospitality.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span className="rounded-full bg-[#003087] px-3 py-1 text-white">1. Choose Offerings</span>
            <span>→</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">2. Choose Hospitality</span>
            <span>→</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">3. Configure &amp; Check Out</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {MATCH_OFFERINGS.map((offer) => (
            <div
              key={offer.title}
              className="flex flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              {offer.badge && (
                <span className="mb-3 w-fit rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-[#003087]">
                  {offer.badge}
                </span>
              )}
              <h3 className="text-xl font-bold text-[#003087]">{offer.title}</h3>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-600">
                {offer.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-[#003087]">•</span>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-500">
                {offer.from > 0 ? (
                  <>
                    Starting at{" "}
                    <strong className="text-lg text-slate-900">
                      {offer.to
                        ? `${formatPrice(offer.from)}–${formatPrice(offer.to)}`
                        : formatPrice(offer.from)}
                    </strong>{" "}
                    USD / per person
                  </>
                ) : (
                  <strong className="text-slate-900">Contact for pricing</strong>
                )}
              </p>
              <Link
                href={offer.href}
                className="fifa-btn-primary mt-4 block rounded py-2.5 text-center text-sm font-bold transition"
              >
                Buy Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
