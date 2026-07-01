"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { HeroTeamSelect } from "@/components/home/HeroTeamSelect";
import { HOST_CITIES } from "@/data/fifa-home";
import { WC26_TEAMS } from "@/data/wc-teams";
import { FIFA_HERO, FIFA_HERO_CDN } from "@/data/home-images";
import { worldCupFilterUrl } from "@/lib/world-cup-url";
import { getFlagUrl } from "@/lib/team-flags";

/** Soft radial blend from center — no hard edges, spreads to both sides */
const HERO_BLEND =
  "radial-gradient(ellipse 90% 130% at 50% 50%, rgba(0,48,135,1) 0%, rgba(0,48,135,0.94) 22%, rgba(0,48,135,0.78) 38%, rgba(0,48,135,0.52) 52%, rgba(0,48,135,0.28) 64%, rgba(0,48,135,0.12) 76%, rgba(0,48,135,0.04) 86%, transparent 100%)";

function HeroEdgeImage({
  src,
  fallback,
  alt,
  className,
}: {
  src: string;
  fallback: string;
  alt: string;
  className: string;
}) {
  return (
    <div className="relative h-full w-1/2 min-h-[220px] lg:min-h-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className}`}
        onError={(e) => {
          const el = e.currentTarget;
          if (!el.src.endsWith(fallback)) el.src = fallback;
        }}
      />
    </div>
  );
}

export function FifaHero() {
  const router = useRouter();
  const [browseMode, setBrowseMode] = useState<"city" | "team">("city");
  const [mounted, setMounted] = useState(false);

  function goMatches(params: { country?: string; stage?: string; q?: string }) {
    router.push(worldCupFilterUrl(params));
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Edge-to-edge images */}
      <div className="absolute inset-0 flex">
        <HeroEdgeImage
          src={FIFA_HERO_CDN.stadium}
          fallback={FIFA_HERO.stadium}
          alt="World Cup stadium atmosphere"
          className="object-cover object-center"
        />
        <HeroEdgeImage
          src={FIFA_HERO_CDN.portrait}
          fallback={FIFA_HERO.portrait}
          alt="World Cup player in action"
          className="object-cover object-top"
        />
      </div>

      {/* Seamless center blend — no visible box edges */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: HERO_BLEND }}
        aria-hidden
      />

      {/* Centered content — transparent, sits on gradient only */}
      <div className="relative z-[2] mx-auto flex min-h-[640px] w-full max-w-[720px] flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:py-16">
          <div className={`mb-8 flex justify-center ${mounted ? "animate-fade-up" : "opacity-0"}`}>
            <CountdownTimer targetDate="2026-06-11T14:00:00" variant="hero" />
          </div>

          <div className={mounted ? "animate-fade-up" : "opacity-0"} style={{ animationDelay: "0.1s" }}>
            <p className="text-xl font-light italic text-blue-200 md:text-2xl lg:text-[1.75rem]">
              Get closer than ever to
            </p>
            <h1 className="mt-1 text-[2.75rem] font-bold leading-[1.05] tracking-tight text-white md:text-6xl xl:text-[4.25rem]">
              FIFA World Cup 26™
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-blue-100 md:text-[1.05rem]">
              Experience the best of it all with official hospitality packages featuring premium
              tickets, food &amp; beverage, entertainment, and more. Now available: single matches
              and private suites!
            </p>
          </div>

          <div
            className={`relative z-30 mx-auto mt-8 max-w-2xl space-y-3 ${
              mounted ? "animate-fade-up" : "pointer-events-none opacity-0"
            }`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Location
                </label>
                <select
                  className="w-full rounded-sm border-0 bg-white px-3 py-3 text-sm text-slate-800 shadow-md outline-none"
                  defaultValue="all"
                  onChange={(e) => goMatches({ country: e.target.value })}
                >
                  <option value="all">Select match location</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                </select>
              </div>
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Team
                </label>
                <HeroTeamSelect onSelect={(team) => goMatches({ q: team })} />
              </div>
              <div className="text-left">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Stage
                </label>
                <select
                  className="w-full rounded-sm border-0 bg-white px-3 py-3 text-sm text-slate-800 shadow-md outline-none"
                  defaultValue="all"
                  onChange={(e) => goMatches({ stage: e.target.value })}
                >
                  <option value="all">Select stage</option>
                  <option value="group">Group Stage</option>
                  <option value="round-of-32">Round of 32</option>
                  <option value="round-of-16">Round of 16</option>
                  <option value="quarter-final">Quarter-finals</option>
                  <option value="semi-final">Semi-finals</option>
                  <option value="final">Final</option>
                </select>
              </div>
            </div>
            <Link
              href="/world-cup"
              className="inline-block rounded-sm bg-white px-8 py-3.5 text-sm font-bold text-[#003087] shadow-lg transition hover:bg-blue-50"
            >
              Browse All Matches
            </Link>
          </div>

          <div
            className={`relative z-10 mx-auto mt-10 max-w-2xl ${mounted ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.35s" }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-200">Browse</p>
            <div className="mb-4 flex justify-center gap-8 border-b border-white/20">
              {(["city", "team"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setBrowseMode(mode)}
                  className={`pb-2.5 text-sm font-bold uppercase tracking-wider transition ${
                    browseMode === mode
                      ? "border-b-2 border-white text-white"
                      : "text-blue-300 hover:text-white"
                  }`}
                >
                  {mode === "city" ? "Host City" : "Team"}
                </button>
              ))}
            </div>
            <div className="flex max-h-28 flex-wrap justify-center gap-2 overflow-y-auto pb-2">
              {browseMode === "city"
                ? HOST_CITIES.map((city) => (
                    <button
                      key={city.slug}
                      type="button"
                      onClick={() => goMatches({ q: city.filterQuery })}
                      className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 transition hover:bg-white/25"
                    >
                      {city.name}
                    </button>
                  ))
                : WC26_TEAMS.map((team) => {
                    const flag = getFlagUrl(team, 32);
                    return (
                      <button
                        key={team}
                        type="button"
                        onClick={() => goMatches({ q: team })}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white ring-1 ring-white/20 transition hover:bg-white/25"
                      >
                        {flag && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                        )}
                        {team}
                      </button>
                    );
                  })}
            </div>
          </div>
      </div>
    </section>
  );
}
