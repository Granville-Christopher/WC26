"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SECTION_IMAGES } from "@/data/home-images";

export function PlatinumRegisterForm() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Thank you for your interest</h2>
        <p className="mt-2 text-slate-600">
          Our concierge team will contact you within 24–48 hours.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm font-bold text-[#003087]">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Register Interest</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <input required placeholder="Full name" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003087]" />
        <input required type="email" placeholder="Email" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003087]" />
        <input placeholder="Company (optional)" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003087] sm:col-span-2" />
        <input type="tel" placeholder="Phone" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003087] sm:col-span-2" />
      </div>
      <textarea
        placeholder="Tell us about your ideal World Cup experience..."
        rows={4}
        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#003087]"
      />
      <button type="submit" className="fifa-btn-primary w-full rounded-lg py-3.5 text-sm font-bold">
        Submit Registration
      </button>
    </form>
  );
}

export function PlatinumHero() {
  return (
    <section className="relative flex min-h-[50vh] items-end overflow-hidden">
      <Image
        src={SECTION_IMAGES.platinum}
        alt="Platinum hospitality"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#001f54] via-[#003087]/60 to-transparent" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-32 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-widest text-blue-200">Additional Offerings</p>
        <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">Platinum Access</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          The most exclusive offering with full-service customization and the most premium access
          available.
        </p>
      </div>
    </section>
  );
}
