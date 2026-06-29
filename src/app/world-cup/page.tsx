import { Suspense } from "react";
import { MatchCard } from "@/components/MatchCard";
import { MatchFilters } from "@/components/MatchFilters";
import { filterMatches, getLiveMatches } from "@/lib/fixtures";

export const revalidate = 3600;

export const metadata = {
  title: "World Cup 2026 Tickets — All Matches",
  description: "Browse all FIFA World Cup 2026 matches with live fixtures. Filter by location, stage, and team.",
};

async function MatchGrid({
  searchParams,
}: {
  searchParams: { country?: string; stage?: string; q?: string };
}) {
  const { matches } = await getLiveMatches();
  const filtered = filterMatches(matches, {
    country: searchParams.country,
    stage: searchParams.stage,
    query: searchParams.q,
  });

  return (
    <>
      <p className="mb-6 text-sm text-slate-500">
        {filtered.length} upcoming match{filtered.length !== 1 ? "es" : ""} · Played fixtures hidden
      </p>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-lg font-medium text-slate-900">No matches found</p>
          <p className="mt-2 text-slate-500">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </>
  );
}

export default async function WorldCupPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; stage?: string; q?: string }>;
}) {
  const params = await searchParams;
  const { matches } = await getLiveMatches();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">World Cup Tickets</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Upcoming FIFA World Cup 2026 matches only — played fixtures are hidden. Includes future
          TBD knockout matches. Standard tickets and hospitality packages from Category 3 to Platinum
          Access.
        </p>
      </div>

      <Suspense fallback={<div className="h-16 animate-pulse rounded-xl bg-slate-200" />}>
        <MatchFilters />
      </Suspense>

      <div className="mt-8">
        <MatchGrid searchParams={params} />
      </div>
    </div>
  );
}
