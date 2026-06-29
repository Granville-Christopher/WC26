import Image from "next/image";
import { getFlagUrl } from "@/lib/team-flags";

export function TeamFlag({
  team,
  size = 40,
  className = "",
}: {
  team: string;
  size?: number;
  className?: string;
}) {
  const url = getFlagUrl(team, size);

  if (!url) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded bg-white/20 text-[10px] font-bold text-white ${className}`}
        style={{ width: size, height: Math.round(size * 0.67) }}
      >
        TBD
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={`${team} flag`}
      width={size}
      height={Math.round(size * 0.67)}
      className={`shrink-0 rounded-sm object-cover shadow-md ring-1 ring-white/30 ${className}`}
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
  const flagSize = compact ? 32 : 44;

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
