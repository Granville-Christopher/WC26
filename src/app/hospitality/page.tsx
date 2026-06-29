import Link from "next/link";
import { HOSPITALITY_TIERS, tierCategoryLabels } from "@/data/tiers";
import { Crown, Wine, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Hospitality & VIP Packages",
  description:
    "Hospitality packages for FIFA World Cup 2026 — VIP, Pitchside, Private Suites, and Platinum Access.",
};

const showcase = HOSPITALITY_TIERS.filter((t) => t.category !== "standard");

export default function HospitalityPage() {
  return (
    <>
      <section className="gradient-premium relative overflow-hidden py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            Premium Experiences
          </p>
          <h1 className="mt-4 text-4xl font-extrabold lg:text-5xl">
            Hospitality & VIP Packages
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
            Premium seating, exclusive lounges, private suites, and unparalleled service across all
            16 host cities — modeled after official FIFA World Cup 26™ hospitality offerings.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        {(["exclusive", "premium", "hospitality"] as const).map((cat) => {
          const tiers = showcase.filter((t) => t.category === cat);
          const Icon = cat === "hospitality" ? Wine : Crown;
          return (
            <div key={cat} className="mb-16">
              <div className="mb-8 flex items-center gap-3">
                <Icon className="h-6 w-6 text-emerald-600" />
                <h2 className="text-2xl font-bold text-slate-900">{tierCategoryLabels[cat]}</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={
                      tier.category === "exclusive" || tier.category === "premium"
                        ? "tier-card-premium rounded-2xl p-6 text-white"
                        : "rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6"
                    }
                  >
                    <h3 className="text-xl font-bold">{tier.name}</h3>
                    <p className="mt-1 text-sm opacity-80">{tier.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed opacity-90">{tier.description}</p>
                    <ul className="mt-4 space-y-1 text-xs opacity-80">
                      {tier.amenities.map((a) => (
                        <li key={a}>✓ {a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="rounded-2xl bg-emerald-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">Ready to experience World Cup 2026 in style?</h2>
          <p className="mt-2 text-emerald-100">Browse all 104 matches and select your package.</p>
          <Link
            href="/world-cup"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            Browse matches
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
