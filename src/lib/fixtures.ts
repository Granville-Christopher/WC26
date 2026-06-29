import "server-only";
import { HOSPITALITY_TIERS } from "@/data/tiers";
import { getDynamicTierPrice, getMatchFloorPrice } from "@/data/fifa-prices";
import { readStore, getTierPrice, getTierStock } from "@/lib/store";
import type { MatchStage, UrgencyBadge, WorldCupMatch } from "@/types";

const FIXTURES_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const FIFA_SCHEDULE_URL = "https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026";

interface RawFixture {
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  group?: string;
  ground: string;
  score?: { ft: [number, number] };
}

interface RawFixturesFile {
  name: string;
  matches: RawFixture[];
}

interface VenueInfo {
  venue: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
}

const VENUE_MAP: Record<string, VenueInfo> = {
  "Mexico City": { venue: "Estadio Azteca", city: "Mexico City", country: "Mexico" },
  "Guadalajara (Zapopan)": { venue: "Estadio Akron", city: "Guadalajara", country: "Mexico" },
  "Monterrey (Guadalupe)": { venue: "Estadio BBVA", city: "Monterrey", country: "Mexico" },
  Toronto: { venue: "BMO Field", city: "Toronto", country: "Canada" },
  Vancouver: { venue: "BC Place", city: "Vancouver", country: "Canada" },
  "New York/New Jersey (East Rutherford)": {
    venue: "MetLife Stadium",
    city: "East Rutherford",
    country: "USA",
  },
  "Los Angeles (Inglewood)": { venue: "SoFi Stadium", city: "Inglewood", country: "USA" },
  "San Francisco Bay Area (Santa Clara)": {
    venue: "Levi's Stadium",
    city: "Santa Clara",
    country: "USA",
  },
  Seattle: { venue: "Lumen Field", city: "Seattle", country: "USA" },
  "Boston (Foxborough)": { venue: "Gillette Stadium", city: "Foxborough", country: "USA" },
  Philadelphia: { venue: "Lincoln Financial Field", city: "Philadelphia", country: "USA" },
  Atlanta: { venue: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA" },
  Miami: { venue: "Hard Rock Stadium", city: "Miami", country: "USA" },
  Houston: { venue: "NRG Stadium", city: "Houston", country: "USA" },
  Dallas: { venue: "AT&T Stadium", city: "Arlington", country: "USA" },
  "Kansas City": { venue: "GEHA Field at Arrowhead Stadium", city: "Kansas City", country: "USA" },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseTimezoneOffset(raw: string): number {
  const m = raw.match(/UTC([+-]?\d+(?:\.\d+)?)/i);
  if (!m) return 0;
  return -Number(m[1]); // negate because Date uses opposite sign convention vs "UTC-6"
}

function parseKickoff(date: string, timeRaw: string): Date {
  const timeMatch = timeRaw.match(/(\d{1,2}):(\d{2})/);
  const hours = timeMatch ? Number(timeMatch[1]) : 12;
  const minutes = timeMatch ? Number(timeMatch[2]) : 0;
  const offsetHours = parseTimezoneOffset(timeRaw);

  // Build UTC time from local kickoff + offset
  const utcMs = Date.UTC(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
    hours + offsetHours,
    minutes
  );
  return new Date(utcMs);
}

function parseTime(raw: string): string {
  const match = raw.match(/(\d{1,2}):(\d{2})/);
  if (!match) return "12:00";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

/** FIFA-style placeholders: TBD, W101, L74, etc. */
function isTbdTeam(name: string): boolean {
  const n = name.trim().toUpperCase();
  return n === "TBD" || /^W\d+$/.test(n) || /^L\d+$/.test(n);
}

function normalizeTeamName(name: string): string {
  return isTbdTeam(name) ? "TBD" : name;
}


/** Upcoming unplayed matches only (includes future TBD knockout fixtures) */
function isSellable(fixture: RawFixture, now = new Date()): boolean {
  if (fixture.score) return false;
  return parseKickoff(fixture.date, fixture.time) >= now;
}

function parseStage(round: string): MatchStage {
  const r = round.toLowerCase();
  if (r.includes("final") && !r.includes("semi") && !r.includes("quarter")) return "final";
  if (r.includes("third")) return "third-place";
  if (r.includes("semi")) return "semi-final";
  if (r.includes("quarter")) return "quarter-final";
  if (r.includes("round of 16") || r.includes("1/8")) return "round-of-16";
  if (r.includes("round of 32") || r.includes("1/16")) return "round-of-32";
  return "group";
}

function parseGroup(group?: string): string | undefined {
  if (!group) return undefined;
  const m = group.match(/Group\s+([A-L])/i);
  return m ? m[1].toUpperCase() : undefined;
}

function getUrgency(matchNumber: number, stage: MatchStage): UrgencyBadge {
  if (stage === "final") return "low-stock";
  if (matchNumber % 7 === 0) return "going-fast";
  if (matchNumber % 5 === 0) return "selling-fast";
  if (matchNumber % 11 === 0) return "great-deal";
  return null;
}

function getRemainingPercent(matchNumber: number, stage: MatchStage): number {
  if (stage === "final") return 2;
  if (stage === "semi-final") return 5;
  return 8 + (matchNumber % 20);
}

function buildDescription(
  home: string,
  away: string,
  venue: VenueInfo,
  stage: MatchStage,
  group?: string
): string {
  const stageLabel =
    stage === "final"
      ? "the World Cup Final"
      : stage === "group"
        ? `Group ${group ?? ""} action`
        : `this ${stage.replace(/-/g, " ")} clash`;
  return `Experience ${home} vs ${away} at ${venue.venue} in ${venue.city}. Premium and hospitality packages available for ${stageLabel} at FIFA World Cup 2026™.`;
}

export async function fetchRawFixtures(): Promise<RawFixturesFile> {
  const res = await fetch(FIXTURES_URL, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch fixtures: ${res.status}`);
  }

  return res.json() as Promise<RawFixturesFile>;
}

export async function getLiveMatches(): Promise<{
  matches: WorldCupMatch[];
  syncedAt: string;
  source: string;
}> {
  const [raw, store] = await Promise.all([fetchRawFixtures(), readStore()]);

  const now = new Date();
  const sellable = raw.matches
    .map((fixture, index) => ({ fixture, matchNumber: index + 1 }))
    .filter(({ fixture }) => isSellable(fixture, now));

  const matches: WorldCupMatch[] = sellable.map(({ fixture, matchNumber }) => {
    const venue = VENUE_MAP[fixture.ground] ?? {
      venue: fixture.ground,
      city: fixture.ground,
      country: "USA" as const,
    };
    const stage = parseStage(fixture.round);
    const group = parseGroup(fixture.group);
    const homeTeam = normalizeTeamName(fixture.team1);
    const awayTeam = normalizeTeamName(fixture.team2);
    const slug = slugify(`match-${matchNumber}-${homeTeam}-vs-${awayTeam}`);

    const tickets = HOSPITALITY_TIERS.map((tier) => {
      const dynamicPrice = getDynamicTierPrice(
        { stage, homeTeam, awayTeam, city: venue.city, matchNumber },
        tier.id
      );
      return {
        ...tier,
        price: getTierPrice(store, slug, tier.id, dynamicPrice),
        currency: store.payment.currency,
        quantity: getTierStock(store, slug, tier.id, tier.category === "exclusive" ? 2 : 8),
      };
    });

    const floorPrice = getMatchFloorPrice({
      stage,
      homeTeam,
      awayTeam,
      city: venue.city,
      matchNumber,
    });

    const prices = tickets.map((t) => t.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const urgency = getUrgency(matchNumber, stage);

    return {
      id: `wc-${String(matchNumber).padStart(3, "0")}`,
      slug,
      matchNumber,
      title: `${homeTeam} vs ${awayTeam}`,
      homeTeam,
      awayTeam,
      group,
      stage,
      round: fixture.round,
      date: fixture.date,
      time: parseTime(fixture.time),
      venue: venue.venue,
      city: venue.city,
      country: venue.country,
      minPrice: floorPrice,
      maxPrice,
      currency: store.payment.currency,
      ticketsRemainingPercent: getRemainingPercent(matchNumber, stage),
      urgency,
      tickets,
      description: buildDescription(homeTeam, awayTeam, venue, stage, group),
    };
  });

  return {
    matches,
    syncedAt: new Date().toISOString(),
    source: FIXTURES_URL,
  };
}

export async function getMatchBySlug(slug: string): Promise<WorldCupMatch | undefined> {
  const { matches } = await getLiveMatches();
  return matches.find((m) => m.slug === slug);
}

export async function getFeaturedMatches(): Promise<WorldCupMatch[]> {
  const { matches } = await getLiveMatches();
  return matches
    .filter(
      (m) =>
        m.urgency === "low-stock" ||
        m.urgency === "going-fast" ||
        m.urgency === "selling-fast" ||
        m.stage === "final"
    )
    .slice(0, 8);
}

export function filterMatches(
  matches: WorldCupMatch[],
  options: { country?: string; stage?: string; query?: string }
): WorldCupMatch[] {
  return matches.filter((m) => {
    if (options.country && options.country !== "all" && m.country !== options.country) return false;
    if (options.stage && options.stage !== "all" && m.stage !== options.stage) return false;
    if (options.query) {
      const q = options.query.toLowerCase();
      const haystack =
        `${m.title} ${m.homeTeam} ${m.awayTeam} ${m.city} ${m.venue} ${m.group ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export { FIFA_SCHEDULE_URL };
