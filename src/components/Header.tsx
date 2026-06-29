import Link from "next/link";
import { Phone } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/world-cup", label: "Single Matches" },
  { href: "/hospitality", label: "Match Offerings" },
  { href: "/platinum-access", label: "Platinum" },
  { href: "/accommodations", label: "Accommodations" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-[#003087] text-xs font-black text-white">
            WC26
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-[#003087]">FIFA World Cup 2026™</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Official Hospitality</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-[#003087]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="tel:+18446521685"
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#003087] md:flex"
          >
            <Phone className="h-4 w-4" />
            +1-844-652-1685
          </a>
          <Link
            href="/world-cup"
            className="fifa-btn-primary rounded px-4 py-2 text-sm font-semibold transition"
          >
            Browse Matches
          </Link>
        </div>
      </div>
    </header>
  );
}
