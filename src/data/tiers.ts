import type { TicketTier, TierId } from "@/types";

export const HOSPITALITY_TIERS: Omit<TicketTier, "price" | "currency" | "quantity">[] = [
  {
    id: "category-1",
    name: "Category 1",
    category: "standard",
    tagline: "Premium sideline seating",
    description: "Closest standard seats to the pitch with excellent sightlines.",
    amenities: ["Premium match ticket", "Dedicated entry gate", "Seat locator map"],
    viewQuality: "excellent",
  },
  {
    id: "category-2",
    name: "Category 2",
    category: "standard",
    tagline: "Mid-tier premium views",
    description: "Outstanding views from mid-tier seating at a great value.",
    amenities: ["Match ticket", "Stadium access guide", "Mobile delivery"],
    viewQuality: "good",
  },
  {
    id: "category-3",
    name: "Category 3",
    category: "standard",
    tagline: "Upper tier — best value",
    description: "Experience the atmosphere from upper-tier seating.",
    amenities: ["Match ticket", "Digital delivery", "Fan guide"],
    viewQuality: "fair",
  },
  {
    id: "vip-lounge",
    name: "VIP",
    category: "hospitality",
    tagline: "Luxury comfort meets electrifying energy",
    description:
      "Exclusive sideline seats with curated themed-menu stations and sommelier-guided beverage service before, at halftime, and after the final whistle.",
    amenities: [
      "Premium sideline seat",
      "Pre-match hospitality",
      "Halftime service",
      "Post-match lounge access",
      "Sommelier beverage service",
    ],
    viewQuality: "premium",
    featured: true,
  },
  {
    id: "trophy-lounge",
    name: "Trophy Lounge",
    category: "hospitality",
    tagline: "Top-tier hospitality & convenience",
    description:
      "Excellent sideline views with premium beverage service and chef-driven menus featuring local flavors — pre-match, halftime, and post-match.",
    amenities: [
      "Sideline hospitality seat",
      "Chef-driven menu",
      "Premium beverages",
      "Halftime lounge access",
      "Dedicated host service",
    ],
    viewQuality: "premium",
    featured: true,
  },
  {
    id: "pitchside-lounge",
    name: "Pitchside Lounge",
    category: "premium",
    tagline: "Where luxury meets the action",
    description:
      "Upscale dining with live cooking stations, premium beverages, and unrivaled seat views near the field along the sidelines.",
    amenities: [
      "Pitchside-adjacent seating",
      "Live cooking stations",
      "Premium open bar",
      "Pre & post-match dining",
      "Preferred entry",
    ],
    viewQuality: "premium",
    featured: true,
  },
  {
    id: "champions-club",
    name: "Champions Club",
    category: "hospitality",
    tagline: "Energy and comfort balanced",
    description:
      "Vibrant atmosphere with exclusive hospitality spaces, beverage service, and chef-carved selections with gourmet shareable plates.",
    amenities: [
      "Premium seat near lounge",
      "Full-course menu",
      "Beverage service",
      "Pre & post-match access",
    ],
    viewQuality: "excellent",
  },
  {
    id: "fifa-pavilion",
    name: "FIFA Pavilion",
    category: "hospitality",
    tagline: "Exclusive stadium perimeter retreat",
    description:
      "Secure perimeter experience with elevated dining, street food classics infused with local flavors, and beverage service pre- and post-match.",
    amenities: [
      "Match ticket included",
      "Pavilion access",
      "Street food dining",
      "Open bar",
      "Pre & post-match entertainment",
    ],
    viewQuality: "good",
  },
  {
    id: "private-suite",
    name: "Private Suite",
    category: "premium",
    tagline: "Exclusive private experience",
    description:
      "Preferred entry, direct seating access, and dedicated service enjoyed privately among you and your guests.",
    amenities: [
      "Private suite for up to 12 guests",
      "Dedicated concierge",
      "In-suite catering",
      "Premium open bar",
      "Preferred parking",
      "Private restroom",
    ],
    viewQuality: "premium",
    featured: true,
  },
  {
    id: "platinum",
    name: "Platinum Access",
    category: "exclusive",
    tagline: "The most exclusive offering",
    description:
      "All-encompassing experience with full-service customization and the most premium access available at the tournament.",
    amenities: [
      "Best available seating",
      "Full customization",
      "Personal concierge",
      "VIP transport options",
      "Meet & greet opportunities",
      "Exclusive merchandise",
    ],
    viewQuality: "premium",
    featured: true,
  },
];

export const tierCategoryLabels: Record<string, string> = {
  standard: "Standard Tickets",
  hospitality: "Hospitality Packages",
  premium: "Premium & Suites",
  exclusive: "Exclusive Access",
};

export function getTierMeta(id: TierId) {
  return HOSPITALITY_TIERS.find((t) => t.id === id);
}
