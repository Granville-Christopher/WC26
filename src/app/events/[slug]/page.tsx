import Link from "next/link";
import { notFound } from "next/navigation";
import { TicketTierGrid } from "@/components/TicketTierGrid";
import { GuaranteeBanner } from "@/components/GuaranteeBanner";
import { getMatchBySlug } from "@/lib/fixtures";
import { stageLabels } from "@/data/fixture-meta";
import { formatDate, formatTime, formatPrice } from "@/lib/utils";
import { ArrowLeft, MapPin, Calendar, Clock, Flame } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  if (!match) return { title: "Match not found" };
  return {
    title: `${match.title} Tickets & Hospitality`,
    description: `Buy tickets and VIP packages for ${match.title} at ${match.venue}. From ${formatPrice(match.minPrice)}.`,
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const match = await getMatchBySlug(slug);
  if (!match) notFound();

  const isHot = match.urgency === "going-fast" || match.urgency === "selling-fast";

  return (
    <div>
      <div className="gradient-premium text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
          <Link
            href="/world-cup"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All World Cup matches
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                  Match {match.matchNumber} · {stageLabels[match.stage]}
                  {match.group ? ` · Group ${match.group}` : ""}
                </p>
                {isHot && (
                  <span className="flex items-center gap-1 rounded-full bg-orange-500/20 px-2.5 py-0.5 text-xs font-semibold text-orange-300">
                    <Flame className="h-3 w-3" /> Going fast
                  </span>
                )}
              </div>
              <h1 className="mt-3 text-3xl font-extrabold lg:text-4xl">{match.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-emerald-400" />
                  {formatDate(match.date)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  {formatTime(match.time)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  {match.venue}, {match.city}, {match.country}
                </span>
              </div>
              {match.score && (
                <p className="mt-3 text-2xl font-bold text-amber-300">
                  Final: {match.score.home} — {match.score.away}
                </p>
              )}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
              <p className="text-sm text-slate-400">Packages from</p>
              <p className="text-3xl font-bold">{formatPrice(match.minPrice)}</p>
              <p className="mt-1 text-xs text-amber-400">
                Platinum from {formatPrice(match.tickets.find((t) => t.id === "platinum")?.price ?? 0)}
              </p>
              {match.ticketsRemainingPercent <= 10 && (
                <p className="mt-2 text-xs font-semibold text-red-400">
                  Only {match.ticketsRemainingPercent}% of tickets left
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Select your package</h2>
            <p className="mb-6 text-sm text-slate-500">
              Prices vary by match — dynamically calculated based on stage, teams, and venue (as on{" "}
              <a
                href="https://fifaworldcup26.hospitality.fifa.com/us/en/"
                className="text-[#003087] underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                FIFA Hospitality
              </a>
              ). Hospitality Packages shown first.
            </p>
            <TicketTierGrid tickets={match.tickets} matchSlug={match.slug} />
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900">About this match</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{match.description}</p>
            </div>
            <GuaranteeBanner />
            <Link
              href="/hospitality"
              className="block rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 text-center transition hover:shadow-md"
            >
              <p className="text-sm font-semibold text-amber-700">Compare hospitality tiers</p>
              <p className="mt-1 text-xs text-slate-500">VIP · Pitchside · Suites · Platinum</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
