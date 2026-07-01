"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/world-cup", label: "Single Matches" },
  { href: "/hospitality", label: "Match Offerings" },
  { href: "/platinum-access", label: "Platinum" },
  { href: "/accommodations", label: "Accommodations" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/guarantee", label: "Buyer Guarantee" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-3 py-3 lg:px-4 xl:px-5">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/wc26-logo.svg"
            alt="FIFA World Cup 2026™"
            className="h-8 w-auto shrink-0 sm:h-9 lg:h-10"
          />
          <div className="hidden min-w-0 leading-tight sm:block">
            <p className="truncate text-xs font-bold text-[#003087] lg:text-sm">
              FIFA World Cup 2026™
            </p>
            <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-slate-500 lg:text-[10px]">
              Official Hospitality
            </p>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-x-8 gap-y-1 px-4 xl:gap-x-10 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-sm font-medium text-slate-700 transition hover:text-[#003087]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <a
            href="tel:+18446521685"
            className="hidden items-center gap-1.5 text-sm font-semibold text-[#003087] xl:flex"
          >
            <Phone className="h-4 w-4" />
            +1-844-652-1685
          </a>
          <Link
            href="/world-cup"
            className="fifa-btn-primary whitespace-nowrap rounded px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm"
          >
            Browse Matches
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded border border-slate-200 text-[#003087] transition hover:bg-slate-50 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 top-[57px] z-40 bg-black/30 lg:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg lg:hidden">
            <div className="mx-auto max-w-[1600px] px-3 py-4 lg:px-4">
              <ul className="flex flex-col gap-1">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-800 transition hover:bg-blue-50 hover:text-[#003087]"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <a
                href="tel:+18446521685"
                className="mt-4 flex items-center gap-2 border-t border-slate-100 px-3 pt-4 text-sm font-semibold text-[#003087]"
              >
                <Phone className="h-4 w-4" />
                +1-844-652-1685
              </a>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
