import type { MatchStage, TierId } from "@/types";
import type { WorldCupMatch } from "@/types";

/**
 * Dynamic FIFA-style pricing — each match priced individually based on
 * stage, teams, and venue (mirrors fifaworldcup26.hospitality.fifa.com).
 *
 * Calibrated: M86 Argentina vs Cape Verde (Miami R32)
 *   Floor (FIFA Pavilion): $3,800 | Pitchside Lounge: ~$9,000
 */

const PREMIUM_TEAMS = new Set([
  "Argentina", "Brazil", "France", "England", "Germany", "Spain",
  "Portugal", "Netherlands", "United States", "Mexico", "Colombia", "Belgium",
]);

const PREMIUM_CITIES = new Set([
  "Miami", "East Rutherford", "Inglewood", "Santa Clara", "Arlington", "Foxborough",
]);

const STAGE_FLOOR_MULTIPLIER: Record<MatchStage, number> = {
  group: 1,
  "round-of-32": 1.95,
  "round-of-16": 2.35,
  "quarter-final": 2.85,
  "semi-final": 3.4,
  "third-place": 3.0,
  final: 4.5,
};

const GROUP_PAVILION_FLOOR = 1400;

/** Hospitality tier price as multiple of match floor (FIFA Pavilion = 1.0) */
const HOSPITALITY_FLOOR_RATIO: Partial<Record<TierId, number>> = {
  "fifa-pavilion": 1.0,
  "champions-club": 1.53,
  "vip-lounge": 2.14,
  "trophy-lounge": 2.29,
  "pitchside-lounge": 2.37,
};

export const TIER_CATEGORY_OPTIONS = [
  { value: "hospitality", label: "Hospitality Packages" },
  { value: "premium", label: "Premium & Suites" },
  { value: "exclusive", label: "Exclusive Access" },
  { value: "standard", label: "Standard Tickets" },
] as const;

export type TierCategoryFilter = (typeof TIER_CATEGORY_OPTIONS)[number]["value"];

export function getMatchFloorPrice(match: Pick<WorldCupMatch, "stage" | "homeTeam" | "awayTeam" | "city" | "matchNumber">): number {
  let price = GROUP_PAVILION_FLOOR * (STAGE_FLOOR_MULTIPLIER[match.stage] ?? 1);

  const teams = [match.homeTeam, match.awayTeam];
  const hasPremiumTeam = teams.some((t) => PREMIUM_TEAMS.has(t));
  const hasTbd = teams.some((t) => t === "TBD");

  if (hasPremiumTeam && !hasTbd) price *= 1.25;
  if (PREMIUM_CITIES.has(match.city)) price *= 1.1;

  // Marquee knockout calibration (Argentina R32 Miami ≈ $3,800 floor)
  if (
    match.stage === "round-of-32" &&
    teams.some((t) => t === "Argentina") &&
    match.city === "Miami"
  ) {
    price = Math.max(price, 3800);
  }

  if (match.stage === "final") price = Math.max(price, 6300);
  if (match.stage === "semi-final") price = Math.max(price, 4750);

  return Math.round(price / 50) * 50;
}

function getPitchsideRatio(match: Pick<WorldCupMatch, "stage" | "homeTeam" | "awayTeam" | "city">): number {
  const marquee =
    match.stage !== "group" &&
    [match.homeTeam, match.awayTeam].some((t) =>
      ["Argentina", "Brazil", "France", "England"].includes(t)
    );
  if (marquee && PREMIUM_CITIES.has(match.city)) return 2.37;
  if (match.stage === "final") return 2.45;
  return 2.37;
}

function getStandardCat1Base(match: Pick<WorldCupMatch, "stage" | "homeTeam" | "awayTeam" | "city">): number {
  const cat1ByStage: Record<MatchStage, number> = {
    group: 620,
    "round-of-32": 750,
    "round-of-16": 980,
    "quarter-final": 1775,
    "semi-final": 3295,
    "third-place": 2500,
    final: 7875,
  };
  let price = cat1ByStage[match.stage] ?? 620;
  const teams = [match.homeTeam, match.awayTeam];
  if (teams.some((t) => PREMIUM_TEAMS.has(t))) price *= 1.2;
  if (PREMIUM_CITIES.has(match.city)) price *= 1.15;
  return Math.round(price / 5) * 5;
}

export function getDynamicTierPrice(
  match: Pick<WorldCupMatch, "stage" | "homeTeam" | "awayTeam" | "city" | "matchNumber">,
  tierId: TierId
): number {
  const floor = getMatchFloorPrice(match);

  if (tierId === "pitchside-lounge") {
    return Math.round(floor * getPitchsideRatio(match));
  }

  if (HOSPITALITY_FLOOR_RATIO[tierId]) {
    return Math.round(floor * HOSPITALITY_FLOOR_RATIO[tierId]!);
  }

  if (tierId === "private-suite") {
    return Math.round(floor * 31.8);
  }

  if (tierId === "platinum") {
    return Math.round(floor * 6.54);
  }

  const cat1 = getStandardCat1Base(match);
  if (tierId === "category-1") return cat1;
  if (tierId === "category-2") return Math.round(cat1 * 0.645);
  if (tierId === "category-3") return Math.round(cat1 * 0.323);

  return floor;
}

/** @deprecated use getDynamicTierPrice */
export function getFifaTierPrice(tierId: TierId, stage: MatchStage): number {
  return getDynamicTierPrice(
    { stage, homeTeam: "TBD", awayTeam: "TBD", city: "Miami", matchNumber: 1 },
    tierId
  );
}

export const FIFA_DEFAULT_PRICES: Record<string, number> = {
  "category-1": 620,
  "category-2": 400,
  "category-3": 200,
  "fifa-pavilion": 1400,
  "champions-club": 2100,
  "vip-lounge": 3000,
  "trophy-lounge": 3200,
  "pitchside-lounge": 3350,
  "private-suite": 43200,
  platinum: 9150,
};
