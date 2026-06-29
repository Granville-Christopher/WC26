/** Map team names to ISO 3166-1 alpha-2 for flagcdn.com */
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
  "Côte d'Ivoire": "ci",
  Croatia: "hr",
  Curaçao: "cw",
  "Czech Republic": "cz",
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
  if (!team || team === "TBD" || /^[WL]\d+/.test(team)) return null;
  return TEAM_FLAG_CODES[team] ?? null;
}

export function getFlagUrl(team: string, width = 80): string | null {
  const code = getTeamFlagCode(team);
  if (!code) return null;
  return `https://flagcdn.com/w${width}/${code}.png`;
}
