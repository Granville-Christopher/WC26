export const HOST_CITIES = [
  { name: "Atlanta", slug: "atlanta", filterQuery: "Atlanta" },
  { name: "Boston", slug: "boston", filterQuery: "Foxborough" },
  { name: "Dallas", slug: "dallas", filterQuery: "Arlington" },
  { name: "Houston", slug: "houston", filterQuery: "Houston" },
  { name: "Kansas City", slug: "kansas-city", filterQuery: "Kansas City" },
  { name: "Los Angeles", slug: "los-angeles", filterQuery: "Inglewood" },
  { name: "Miami", slug: "miami", filterQuery: "Miami" },
  { name: "New York/New Jersey", slug: "new-york", filterQuery: "East Rutherford" },
  { name: "Philadelphia", slug: "philadelphia", filterQuery: "Philadelphia" },
  { name: "Seattle", slug: "seattle", filterQuery: "Seattle" },
  { name: "San Francisco Bay Area", slug: "san-francisco", filterQuery: "Santa Clara" },
  { name: "Toronto", slug: "toronto", filterQuery: "Toronto" },
  { name: "Vancouver", slug: "vancouver", filterQuery: "Vancouver" },
  { name: "Guadalajara", slug: "guadalajara", filterQuery: "Guadalajara" },
  { name: "Mexico City", slug: "mexico-city", filterQuery: "Mexico City" },
  { name: "Monterrey", slug: "monterrey", filterQuery: "Monterrey" },
];

export const TEAMS = [
  { name: "Argentina", code: "ARG" }, { name: "Brazil", code: "BRA" },
  { name: "France", code: "FRA" }, { name: "England", code: "ENG" },
  { name: "Germany", code: "GER" }, { name: "Spain", code: "ESP" },
  { name: "United States", code: "USA" }, { name: "Mexico", code: "MEX" },
  { name: "Canada", code: "CAN" }, { name: "Colombia", code: "COL" },
  { name: "Portugal", code: "POR" }, { name: "Netherlands", code: "NED" },
  { name: "Belgium", code: "BEL" }, { name: "Croatia", code: "CRO" },
  { name: "Morocco", code: "MAR" }, { name: "Japan", code: "JPN" },
  { name: "Korea Republic", code: "KOR" }, { name: "Australia", code: "AUS" },
  { name: "Cape Verde", code: "CPV" }, { name: "Ghana", code: "GHA" },
  { name: "Egypt", code: "EGY" }, { name: "Switzerland", code: "SUI" },
  { name: "Uruguay", code: "URU" }, { name: "Ecuador", code: "ECU" },
];

export const MATCH_OFFERINGS = [
  {
    title: "Single Match",
    badge: "Now Available",
    from: 1350,
    to: 2500,
    bullets: ["1 match of your choice", "Pitchside, VIP, Trophy, Champions, FIFA Pavilion"],
    href: "/world-cup",
  },
  {
    title: "Venue Series",
    from: 8275,
    bullets: ["4–9 matches at one stadium", "All stages eligible", "Premium hospitality included"],
    href: "/hospitality",
  },
  {
    title: "Follow My Team",
    from: 6750,
    bullets: ["3 group + 1 Round of 32", "Follow your nation", "Premium seating & hospitality"],
    href: "/hospitality",
  },
  {
    title: "Multi-Match Series",
    from: 0,
    bullets: ["4–5 match bundles", "Tiered unlock to Final", "Contact for custom packages"],
    href: "/platinum-access",
  },
];

export const LOUNGE_TIERS = [
  {
    name: "Pitchside Lounge",
    description:
      "Upscale dining with live cooking stations and premium beverage service. Unrivaled seat views near the field along the sidelines.",
  },
  {
    name: "VIP",
    description:
      "Premium sideline seats with curated themed-menu stations and sommelier-guided beverage service before, at halftime, and after.",
  },
  {
    name: "Trophy Lounge",
    description:
      "Excellent sideline views with premium beverage service and chef-driven menus featuring local flavors pre-match, halftime, and post-match.",
  },
  {
    name: "Champions Club",
    description:
      "Vibrant atmosphere with beverage service and a full-course menu featuring chef-carved selections and gourmet shareable plates.",
  },
  {
    name: "FIFA Pavilion",
    description:
      "Exclusive retreat within the secure perimeter — elevated dining with street food classics infused with local flavors.",
  },
];
