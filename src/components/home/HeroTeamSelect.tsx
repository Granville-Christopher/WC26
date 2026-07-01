"use client";

import { useState } from "react";
import { WC26_TEAMS } from "@/data/wc-teams";
import { getFlagUrl } from "@/lib/team-flags";

export function HeroTeamSelect({
  onSelect,
}: {
  onSelect?: (team: string) => void;
}) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const team = e.target.value;
    setValue(team);
    onSelect?.(team);
  }

  const flagUrl = value ? getFlagUrl(value, 40) : null;

  return (
    <div className="relative">
      {flagUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={flagUrl}
          alt=""
          className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 rounded-full object-cover ring-1 ring-slate-200"
        />
      )}
      <select
        value={value}
        onChange={handleChange}
        className={`w-full rounded-sm border-0 bg-white py-3 text-sm text-slate-800 shadow-md outline-none ${
          flagUrl ? "pl-10 pr-3" : "px-3"
        }`}
      >
        <option value="">Select your team</option>
        {WC26_TEAMS.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
    </div>
  );
}
