import { ShieldCheck, RefreshCw, BadgeCheck, Headphones } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "CupVault Guarantee",
  description: "Every World Cup ticket order is protected by the CupVault Guarantee.",
};

const features = [
  {
    icon: BadgeCheck,
    title: "Valid tickets guaranteed",
    description:
      "All sellers are verified. Every ticket listed must be valid and transferable for the stated match.",
  },
  {
    icon: RefreshCw,
    title: "On-time delivery",
    description:
      "You'll receive your tickets before match day. If not, we'll provide replacement tickets or a full refund.",
  },
  {
    icon: ShieldCheck,
    title: "Full refund protection",
    description:
      "If your order can't be fulfilled as described, you get your money back — no questions asked.",
  },
  {
    icon: Headphones,
    title: "24/7 support",
    description:
      "Our team is here to help before, during, and after your purchase. World Cup travel questions welcome.",
  },
];

export default function GuaranteePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6">
      <div className="text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-emerald-600" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">The CupVault Guarantee</h1>
        <p className="mt-3 text-lg text-gray-600">
          Buy World Cup tickets with confidence. Every order is backed by our buyer protection program.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl border border-gray-200 bg-white p-6">
            <Icon className="h-8 w-8 text-emerald-600" />
            <h2 className="mt-4 font-semibold text-gray-900">{title}</h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-emerald-50 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">Ready to find your match?</h2>
        <p className="mt-2 text-gray-600">Browse all 104 World Cup 2026 matches.</p>
        <Link
          href="/world-cup"
          className="mt-6 inline-block rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Browse matches
        </Link>
      </div>
    </div>
  );
}
