export type MatchStage =
  | "group"
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "third-place"
  | "final";

export type UrgencyBadge = "selling-fast" | "low-stock" | "great-deal" | "going-fast" | null;

export type TierCategory = "standard" | "hospitality" | "premium" | "exclusive";

export type TierId =
  | "category-1"
  | "category-2"
  | "category-3"
  | "vip-lounge"
  | "trophy-lounge"
  | "pitchside-lounge"
  | "champions-club"
  | "fifa-pavilion"
  | "private-suite"
  | "platinum";

export interface TicketTier {
  id: TierId;
  name: string;
  category: TierCategory;
  tagline: string;
  description: string;
  amenities: string[];
  price: number;
  currency: string;
  quantity: number;
  viewQuality: "excellent" | "premium" | "good" | "fair";
  featured?: boolean;
}

export interface WorldCupMatch {
  id: string;
  slug: string;
  matchNumber: number;
  title: string;
  homeTeam: string;
  awayTeam: string;
  group?: string;
  stage: MatchStage;
  round: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  country: "USA" | "Canada" | "Mexico";
  minPrice: number;
  maxPrice: number;
  currency: string;
  ticketsRemainingPercent: number;
  urgency: UrgencyBadge;
  tickets: TicketTier[];
  description: string;
  score?: { home: number; away: number };
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface PaymentMethodDetails {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  routingNumber?: string;
  swiftCode?: string;
  email?: string;
  walletAddress?: string;
  network?: string;
  provider?: string;
  paymentLink?: string;
  instructions?: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  enabled: boolean;
  details: PaymentMethodDetails;
}

export interface PaymentSettings {
  currency: string;
  supportEmail: string;
  checkoutNote: string;
  methods: PaymentMethod[];
}

export interface StoreData {
  payment: PaymentSettings;
  tierPrices: {
    default: Record<string, number>;
    byMatchSlug: Record<string, Record<string, number>>;
  };
  tierStock: {
    default: Record<string, number>;
    byMatchSlug: Record<string, Record<string, number>>;
  };
  lastFixtureSync: string | null;
}

export interface CheckoutOrder {
  matchSlug: string;
  tierId: TierId;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethodId: string;
}
