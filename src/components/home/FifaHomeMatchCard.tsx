import Link from "next/link";
import type { WorldCupMatch } from "@/types";
import { formatPrice } from "@/lib/utils";
import { MatchTeamsRow } from "@/components/TeamFlag";

export function FifaHomeMatchCard({ match }: { match: WorldCupMatch }) {
  const date = new Date(match.date + "T12:00:00");
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();

  const isHot =
    match.urgency === "going-fast" ||
    match.urgency === "selling-fast" ||
    match.urgency === "low-stock";

  return (
    <Link
      href={`/events/${match.slug}`}
      className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:border-[#003087]/30 hover:shadow-lg sm:w-[300px]"
    >
      <div className="relative bg-gradient-to-br from-[#003087] to-[#001f54] px-4 py-5 text-center text-white">
        {isHot && (
          <span className="absolute left-3 top-3 rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase">
            Going Fast
          </span>
        )}
        <MatchTeamsRow homeTeam={match.homeTeam} awayTeam={match.awayTeam} compact />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-center text-sm text-slate-600">
          {weekday}, {month} {day}
        </p>
        <p className="text-center text-sm font-medium text-slate-800">{match.time}</p>
        <p className="mt-2 text-center text-xs text-slate-500">
          {match.venue}, {match.country}
        </p>
        <p className="mt-1 text-center text-xs font-medium text-slate-400">
          M{match.matchNumber}: {match.homeTeam} vs. {match.awayTeam}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="text-sm font-bold text-[#003087]">Buy Now</span>
          <span className="text-sm font-bold text-slate-900">
            {formatPrice(match.minPrice, match.currency)} USD each
          </span>
        </div>
      </div>
    </Link>
  );
}
