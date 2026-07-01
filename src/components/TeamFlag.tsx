"use client";

import { useState } from "react";
import { getFlagSources } from "@/lib/team-flags";

export function TeamFlag({
  team,
  size = 40,
  className = "",
}: {
  team: string;
  size?: number;
  className?: string;
}) {
  const sources = getFlagSources(team);
  const [srcIndex, setSrcIndex] = useState(0);

  if (!sources) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold text-white ${className}`}
        style={{ width: size, height: size }}
      >
        TBD
      </div>
    );
  }

  const src = sources[srcIndex] ?? sources[0];

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${team} flag`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={`shrink-0 rounded-full bg-white/10 object-cover shadow-md ring-2 ring-white/40 ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      onError={() => {
        if (srcIndex < sources.length - 1) setSrcIndex((i) => i + 1);
      }}
    />
  );
}

export function MatchTeamsRow({
  homeTeam,
  awayTeam,
  compact = false,
}: {
  homeTeam: string;
  awayTeam: string;
  compact?: boolean;
}) {
  const flagSize = compact ? 36 : 48;

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
        <TeamFlag team={homeTeam} size={flagSize} />
        <span className="max-w-full truncate text-center text-xs font-bold text-white sm:text-sm">
          {homeTeam}
        </span>
      </div>
      <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white sm:text-xs">
        VS
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
        <TeamFlag team={awayTeam} size={flagSize} />
        <span className="max-w-full truncate text-center text-xs font-bold text-white sm:text-sm">
          {awayTeam}
        </span>
      </div>
    </div>
  );
}
