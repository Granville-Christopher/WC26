import Link from "next/link";
import type { WorldCupMatch } from "@/types";
import { formatDate, formatTime, formatPrice, cn } from "@/lib/utils";
import { MapPin, ChevronRight, Flame } from "lucide-react";
import { MatchTeamsRow } from "@/components/TeamFlag";

const urgencyConfig = {
  "selling-fast": { label: "Selling fast", className: "bg-orange-500/90 text-white" },
  "going-fast": { label: "Going fast", className: "bg-amber-500/90 text-white" },
  "low-stock": {
    label: (pct: number) => `Only ${pct}% left`,
    className: "bg-red-600/90 text-white",
  },
  "great-deal": { label: "Great deal", className: "bg-[#003087]/90 text-white" },
};

export function MatchCard({ match }: { match: WorldCupMatch }) {
  const badge = match.urgency ? urgencyConfig[match.urgency] : null;
  const isPremium = match.stage === "final" || match.stage === "semi-final";

  return (
    <Link
      href={`/events/${match.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#003087]/40 hover:shadow-xl hover:shadow-[#003087]/10"
    >
      <div
        className={cn(
          "relative overflow-hidden px-4 py-6",
          isPremium ? "gradient-premium" : "bg-gradient-to-br from-[#003087] via-[#002a6e] to-[#001f54]"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative">
          <MatchTeamsRow homeTeam={match.homeTeam} awayTeam={match.awayTeam} />
        </div>
        {match.stage === "final" && (
          <div className="gradient-gold absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-black text-slate-900">
            FINAL
          </div>
        )}
        {badge && (
          <div
            className={cn(
              "absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-lg",
              badge.className
            )}
          >
            {match.urgency === "going-fast" || match.urgency === "selling-fast" ? (
              <Flame className="h-3 w-3" />
            ) : null}
            {typeof badge.label === "function" ? badge.label(match.ticketsRemainingPercent) : badge.label}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#003087]">
          Match {match.matchNumber}
          {match.group ? ` · Group ${match.group}` : ""}
          {" · "}
          {match.city}
        </p>
        <h3 className="mt-1.5 font-semibold text-slate-900 group-hover:text-[#003087]">
          {match.title}
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {formatDate(match.date)} · {formatTime(match.time)}
        </p>
        <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#003087]" />
          <span className="truncate">{match.venue}</span>
        </div>
        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-400">Packages from</p>
            <p className="text-xl font-bold text-slate-900">{formatPrice(match.minPrice)}</p>
            <p className="mt-1 text-xs text-slate-400">
              Pitchside from{" "}
              {formatPrice(
                match.tickets.find((t) => t.id === "pitchside-lounge")?.price ?? match.minPrice * 2.4
              )}
            </p>
          </div>
          <span className="flex items-center gap-1 text-sm font-semibold text-[#003087] transition-all group-hover:gap-2">
            View packages
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
