import Link from "next/link";
import { Search, Ticket, ShieldCheck, Mail } from "lucide-react";

export const metadata = {
  title: "How It Works",
  description: "Learn how to buy FIFA World Cup 2026 tickets on CupVault in three simple steps.",
};

const steps = [
  {
    icon: Search,
    step: 1,
    title: "Find your match",
    description:
      "Browse all 104 World Cup 2026 matches. Filter by city, country, or tournament stage. Search by team name or venue.",
  },
  {
    icon: Ticket,
    step: 2,
    title: "Choose your seats",
    description:
      "Compare Category 1, 2, and 3 ticket options. See prices, availability, and view quality for each listing.",
  },
  {
    icon: ShieldCheck,
    step: 3,
    title: "Checkout securely",
    description:
      "Click Get tickets to complete your purchase through our secure checkout. Receive confirmation instantly.",
  },
  {
    icon: Mail,
    step: 4,
    title: "Receive your tickets",
    description:
      "Digital tickets are delivered before match day. Show them at the venue and enjoy the world's greatest sporting event.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <h1 className="text-3xl font-bold text-gray-900">How it works</h1>
      <p className="mt-2 text-gray-600">
        Buying World Cup tickets on CupVault is simple and secure.
      </p>

      <div className="mt-12 space-y-8">
        {steps.map(({ icon: Icon, step, title, description }) => (
          <div key={step} className="flex gap-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
              {step}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              </div>
              <p className="mt-2 text-gray-600 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/world-cup"
          className="inline-block rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Start browsing matches
        </Link>
      </div>
    </div>
  );
}
