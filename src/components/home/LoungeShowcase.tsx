import Image from "next/image";
import Link from "next/link";
import { LOUNGE_TIERS } from "@/data/fifa-home";
import { LOUNGE_IMAGES, FIFA_HERO, SECTION_IMAGES } from "@/data/home-images";

export function LoungeShowcase() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Unrivaled Lounge access</h2>
          <p className="mx-auto mt-3 max-w-3xl text-slate-600">
            Each of the 16 FIFA World Cup 2026™ host venues offers multiple lounge options, all of
            which blend luxury comfort with extraordinary viewing access.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {LOUNGE_TIERS.map((lounge, i) => (
            <div
              key={lounge.name}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl animate-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={LOUNGE_IMAGES[lounge.name] ?? FIFA_HERO.stadium}
                  alt={lounge.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-110"
                  sizes="(max-width:768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/80 to-transparent" />
                <h3 className="absolute bottom-4 left-4 text-lg font-bold text-white">{lounge.name}</h3>
              </div>
              <p className="p-5 text-sm leading-relaxed text-slate-600">{lounge.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/hospitality" className="text-sm font-bold text-[#003087] hover:underline">
            View all hospitality packages →
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PrivateSuitesSection() {
  return (
    <section className="relative overflow-hidden py-24 text-white">
      <Image
        src={SECTION_IMAGES.privateSuites}
        alt="Private suite hospitality"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#003087]/85" />
      <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
        <h2 className="text-3xl font-bold md:text-4xl">Private Suites</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          Level up with preferred entry, direct seating access, and dedicated service – enjoyed
          privately among you and your guests.
        </p>
        <Link
          href="/world-cup?stage=final"
          className="mt-8 inline-block rounded bg-white px-10 py-3.5 text-sm font-bold text-[#003087] shadow-xl transition hover:scale-105"
        >
          Buy Now
        </Link>
      </div>
    </section>
  );
}

export function AdditionalOfferings() {
  return (
    <section className="bg-[#f4f5f7] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">Additional Offerings</h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-slate-600">
          Specialty offerings available via inquiry or direct purchase.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
            <div className="relative h-56">
              <Image
                src={SECTION_IMAGES.platinum}
                alt="Platinum access"
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 600px"
              />
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#003087]">Platinum access</h3>
              <p className="mt-3 text-sm text-slate-600">
                The most exclusive offering. Full-service customization and the most premium access
                available.
              </p>
              <Link
                href="/platinum-access"
                className="mt-6 inline-block rounded bg-[#003087] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#001f54]"
              >
                Register Interest →
              </Link>
            </div>
          </div>
          <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
            <div className="relative h-56">
              <Image
                src={SECTION_IMAGES.accommodations}
                alt="Accommodations"
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 600px"
              />
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-[#003087]">Accommodations</h3>
              <p className="mt-3 text-sm text-slate-600">
                Select your preferred hotels, experiences, and/or car rentals to create your ideal
                trip package.
              </p>
              <Link
                href="/accommodations"
                className="mt-6 inline-block rounded bg-[#003087] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#001f54]"
              >
                Buy Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OnLocationStats() {
  return (
    <section className="border-y border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900">Why Choose Official Hospitality?</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          As the official hospitality provider of world-renowned events like the Olympic Games and
          Super Bowl, we create extraordinary experiences for memories that last a lifetime.
        </p>
        <div className="mt-10 animate-fade-up">
          <p className="text-5xl font-bold text-[#003087]">2m</p>
          <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Global Guests Hosted Annually
          </p>
        </div>
      </div>
    </section>
  );
}
