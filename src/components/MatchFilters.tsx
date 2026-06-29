"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { countries, stageLabels } from "@/data/fixture-meta";

export function MatchFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const country = params.get("country") ?? "all";
  const stage = params.get("stage") ?? "all";
  const q = params.get("q") ?? "";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "all" || value === "") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    router.push(`/world-cup?${next.toString()}`);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex items-center gap-2">
        <label htmlFor="country-filter" className="text-sm font-medium text-gray-700">
          Location
        </label>
        <select
          id="country-filter"
          value={country}
          onChange={(e) => update("country", e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          {countries.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="stage-filter" className="text-sm font-medium text-gray-700">
          Stage
        </label>
        <select
          id="stage-filter"
          value={stage}
          onChange={(e) => update("stage", e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">All stages</option>
          {Object.entries(stageLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {q && (
        <p className="text-sm text-gray-500">
          Showing results for &ldquo;{q}&rdquo;
        </p>
      )}
    </div>
  );
}
