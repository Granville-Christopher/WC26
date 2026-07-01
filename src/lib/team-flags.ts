/** Map team names to ISO 3166-1 alpha-2 for flags */
const TEAM_FLAG_CODES: Record<string, string> = {
  Algeria: "dz",
  Argentina: "ar",
  Australia: "au",
  Austria: "at",
  Belgium: "be",
  "Bosnia & Herzegovina": "ba",
  "Bosnia and Herzegovina": "ba",
  Brazil: "br",
  Canada: "ca",
  "Cape Verde": "cv",
  "Cabo Verde": "cv",
  Colombia: "co",
  "Congo - Kinshasa": "cd",
  "Congo DRC": "cd",
  "DR Congo": "cd",
  "Côte d'Ivoire": "ci",
  "Ivory Coast": "ci",
  Croatia: "hr",
  Curaçao: "cw",
  Curacao: "cw",
  "Czech Republic": "cz",
  Czechia: "cz",
  Ecuador: "ec",
  Egypt: "eg",
  England: "gb-eng",
  France: "fr",
  Germany: "de",
  Ghana: "gh",
  Haiti: "ht",
  Iran: "ir",
  Iraq: "iq",
  Japan: "jp",
  Jordan: "jo",
  "Korea Republic": "kr",
  "South Korea": "kr",
  Mexico: "mx",
  Morocco: "ma",
  Netherlands: "nl",
  "New Zealand": "nz",
  Norway: "no",
  Panama: "pa",
  Paraguay: "py",
  Portugal: "pt",
  Qatar: "qa",
  "Saudi Arabia": "sa",
  Scotland: "gb-sct",
  Senegal: "sn",
  "South Africa": "za",
  Spain: "es",
  Sweden: "se",
  Switzerland: "ch",
  Tunisia: "tn",
  Türkiye: "tr",
  Turkey: "tr",
  "United States": "us",
  USA: "us",
  Uruguay: "uy",
  Uzbekistan: "uz",
};

export function getTeamFlagCode(team: string): string | null {
  if (!team || team === "TBD" || /^[WL]\d+$/i.test(team.trim())) return null;

  const trimmed = team.trim();
  if (TEAM_FLAG_CODES[trimmed]) return TEAM_FLAG_CODES[trimmed];

  const lower = trimmed.toLowerCase();
  const hit = Object.entries(TEAM_FLAG_CODES).find(([name]) => name.toLowerCase() === lower);
  return hit?.[1] ?? null;
}

function localFlagPath(code: string): string {
  if (code.includes("-")) return `/flags/${code}.png`;
  return `/flags/${code}.svg`;
}

function cdnFlagUrls(code: string): string[] {
  const urls: string[] = [];
  if (!code.includes("-")) {
    urls.push(`https://hatscripts.github.io/circle-flags/flags/${code}.svg`);
  }
  urls.push(`https://flagcdn.com/w160/${code}.png`);
  return urls;
}

/** Local file first, then CDN fallbacks — most reliable on Vercel */
export function getFlagSources(team: string): string[] | null {
  const code = getTeamFlagCode(team);
  if (!code) return null;
  return [localFlagPath(code), ...cdnFlagUrls(code)];
}

export function getFlagUrl(team: string, _width = 80): string | null {
  const sources = getFlagSources(team);
  return sources?.[0] ?? null;
}
