"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { TicketTier, TierCategory } from "@/types";
import { TIER_CATEGORY_OPTIONS, type TierCategoryFilter } from "@/data/fifa-prices";
import { Check, ChevronDown, Crown, Sparkles, Wine } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<TierCategory, typeof Wine> = {
  standard: Sparkles,
  hospitality: Wine,
  premium: Crown,
  exclusive: Crown,
};

export function TicketTierGrid({
  tickets,
  matchSlug,
}: {
  tickets: TicketTier[];
  matchSlug: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<TierCategoryFilter>("hospitality");

  const filtered = tickets.filter((t) => t.category === selectedCategory);
  const selectedLabel =
    TIER_CATEGORY_OPTIONS.find((o) => o.value === selectedCategory)?.label ?? "";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Select package type</h2>
          <p className="mt-1 text-sm text-slate-500">
            Official FIFA tier categories — prices per person unless noted
          </p>
        </div>
        <div className="relative min-w-[240px]">
          <label htmlFor="tier-category" className="sr-only">
            Package type
          </label>
          <select
            id="tier-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as TierCategoryFilter)}
            className="w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          >
            {TIER_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="font-medium text-slate-700">No packages in this category</p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            {(() => {
              const Icon = categoryIcons[selectedCategory as TierCategory] ?? Sparkles;
              return <Icon className="h-5 w-5 text-emerald-600" />;
            })()}
            <h3 className="text-base font-bold text-slate-900">{selectedLabel}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {filtered.length} option{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((tier) => (
              <TierCard key={tier.id} tier={tier} matchSlug={matchSlug} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TierCard({ tier, matchSlug }: { tier: TicketTier; matchSlug: string }) {
  const isLuxury = tier.category === "premium" || tier.category === "exclusive";
  const isSuite = tier.id === "private-suite";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 transition hover:shadow-lg",
        isLuxury
          ? "tier-card-premium border-amber-500/30 text-white shadow-xl shadow-amber-500/5"
          : tier.category === "hospitality"
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50"
            : "border-slate-200 bg-white"
      )}
    >
      {tier.featured && (
        <div className="gradient-gold absolute right-4 top-4 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-900">
          Featured
        </div>
      )}

      <p
        className={cn(
          "text-xs font-semibold uppercase tracking-wider",
          isLuxury ? "text-amber-400" : "text-emerald-600"
        )}
      >
        {tier.tagline}
      </p>
      <h4 className={cn("mt-1 text-xl font-bold", isLuxury ? "text-white" : "text-slate-900")}>
        {tier.name}
      </h4>
      <p
        className={cn(
          "mt-2 text-sm leading-relaxed",
          isLuxury ? "text-slate-300" : "text-slate-600"
        )}
      >
        {tier.description}
      </p>

      <ul className="mt-4 space-y-1.5">
        {tier.amenities.slice(0, 4).map((a) => (
          <li
            key={a}
            className={cn(
              "flex items-center gap-2 text-xs",
              isLuxury ? "text-slate-300" : "text-slate-600"
            )}
          >
            <Check
              className={cn(
                "h-3.5 w-3.5 shrink-0",
                isLuxury ? "text-amber-400" : "text-emerald-500"
              )}
            />
            {a}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className={cn("text-xs", isLuxury ? "text-slate-400" : "text-slate-500")}>
            {tier.quantity} available
          </p>
          <p className={cn("text-2xl font-bold", isLuxury ? "text-amber-300" : "text-slate-900")}>
            {formatPrice(tier.price, tier.currency)}
          </p>
          <p className={cn("text-xs", isLuxury ? "text-slate-400" : "text-slate-500")}>
            {isSuite ? "per suite" : "per person"}
          </p>
        </div>
        <Link
          href={`/checkout/${matchSlug}?tier=${tier.id}`}
          className={cn(
            "shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition",
            isLuxury
              ? "gradient-gold text-slate-900 hover:opacity-90"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          )}
        >
          Select
        </Link>
      </div>
    </div>
  );
}
