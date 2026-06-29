import Link from "next/link";
import type { WorldCupMatch } from "@/types";
import { FifaHomeMatchCard } from "./FifaHomeMatchCard";

const STAGE_TABS = [
  { label: "Popular", value: "popular" },
  { label: "Group Stage", value: "group" },
  { label: "Round of 32", value: "round-of-32" },
];

export function SingleMatchesSection({ matches }: { matches: WorldCupMatch[] }) {
  const popular = matches.filter(
    (m) =>
      m.urgency === "going-fast" ||
      m.urgency === "selling-fast" ||
      m.stage === "round-of-32" ||
      m.stage === "final"
  );
  const display = (popular.length ? popular : matches).slice(0, 12);

  return (
    <section className="bg-[#f4f5f7] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Single Matches</h2>
            <p className="mt-2 text-slate-600">
              Choose from {matches.length} upcoming matches across 16 dynamic host cities and venues.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/world-cup"
              className="fifa-btn-primary rounded px-5 py-2.5 text-sm font-bold transition"
            >
              Explore All Matches
            </Link>
            <Link
              href="/world-cup"
              className="rounded border border-[#003087] px-5 py-2.5 text-sm font-bold text-[#003087] transition hover:bg-blue-50"
            >
              View Schedule
            </Link>
          </div>
        </div>

        <div className="mb-6 flex gap-2">
          {STAGE_TABS.map((tab, i) => (
            <Link
              key={tab.value}
              href={tab.value === "popular" ? "/world-cup" : `/world-cup?stage=${tab.value}`}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
                i === 0
                  ? "bg-[#003087] text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {display.map((match) => (
            <FifaHomeMatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </section>
  );
}
