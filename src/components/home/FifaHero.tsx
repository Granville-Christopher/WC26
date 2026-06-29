"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { HOST_CITIES, TEAMS } from "@/data/fifa-home";
import { FIFA_HERO } from "@/data/home-images";

const HERO_IMAGES = [
  {
    src: FIFA_HERO.stadium,
    alt: "World Cup stadium atmosphere",
    className: "object-cover object-center",
  },
  {
    src: FIFA_HERO.portrait,
    alt: "World Cup player in action",
    className: "object-cover object-top",
  },
];

function HeroCrossfade({ className = "" }: { className?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((i) => (i + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {HERO_IMAGES.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={i === 0}
            className={img.className}
            sizes="(max-width:1024px) 100vw, 55vw"
          />
        </div>
      ))}
      {/* Blend into blue left panel */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#003087] to-transparent lg:w-32" />
      {/* Dot indicators */}
      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show image ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function FifaHero() {
  const [browseMode, setBrowseMode] = useState<"city" | "team">("city");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#003087]">
      {/* Desktop — crossfading images on the right (one visible at a time) */}
      <HeroCrossfade className="absolute inset-y-0 right-0 hidden w-[55%] lg:block xl:w-[52%]" />

      {/* Mobile / tablet — same crossfade */}
      <HeroCrossfade className="relative h-64 w-full lg:hidden" />

      {/* Left content column */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 lg:px-8 lg:py-14 xl:py-16">
        <div
          className={`mb-8 lg:max-w-xl ${mounted ? "animate-fade-up" : "opacity-0"}`}
        >
          <CountdownTimer targetDate="2026-06-11T14:00:00" variant="hero" />
        </div>

        <div className="lg:max-w-[580px] xl:max-w-[640px]">
          <div className={mounted ? "animate-fade-up" : "opacity-0"} style={{ animationDelay: "0.1s" }}>
            <p className="text-xl font-light italic text-blue-200 md:text-2xl lg:text-[1.75rem]">
              Get closer than ever to
            </p>
            <h1 className="mt-1 text-[2.75rem] font-bold leading-[1.05] tracking-tight text-white md:text-6xl xl:text-[4.25rem]">
              FIFA World Cup 26™
            </h1>
            <p className="mt-5 text-base leading-relaxed text-blue-100 md:text-[1.05rem]">
              Experience the best of it all with official hospitality packages featuring premium
              tickets, food &amp; beverage, entertainment, and more. Now available: single matches
              and private suites!
            </p>
          </div>

          <form
            action="/world-cup"
            method="get"
            className={`mt-8 space-y-3 ${mounted ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.2s" }}
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Location
                </label>
                <select
                  name="country"
                  className="w-full rounded-sm border-0 bg-white px-3 py-3 text-sm text-slate-800 shadow-md outline-none"
                  defaultValue="all"
                >
                  <option value="all">Select match location</option>
                  <option value="USA">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Team
                </label>
                <input
                  name="q"
                  placeholder="Select your team"
                  className="w-full rounded-sm border-0 bg-white px-3 py-3 text-sm text-slate-800 shadow-md outline-none placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Stage
                </label>
                <select
                  name="stage"
                  className="w-full rounded-sm border-0 bg-white px-3 py-3 text-sm text-slate-800 shadow-md outline-none"
                  defaultValue="all"
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
          </form>

          <div
            className={`mt-10 ${mounted ? "animate-fade-up" : "opacity-0"}`}
            style={{ animationDelay: "0.35s" }}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-blue-200">
              Browse
            </p>
            <div className="mb-4 flex gap-8 border-b border-white/20">
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
            <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto pb-2">
              {browseMode === "city"
                ? HOST_CITIES.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/world-cup?q=${encodeURIComponent(city.name)}`}
                      className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white ring-1 ring-white/20 transition hover:bg-white/25"
                    >
                      {city.name}
                    </Link>
                  ))
                : TEAMS.map((team) => (
                    <Link
                      key={team.code}
                      href={`/world-cup?q=${encodeURIComponent(team.name)}`}
                      className="rounded-full bg-white/10 px-2.5 py-1.5 text-xs font-bold text-white ring-1 ring-white/20 transition hover:bg-white/25"
                    >
                      {team.code}
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
