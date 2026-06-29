import Image from "next/image";
import Link from "next/link";
import { SECTION_IMAGES } from "@/data/home-images";

export const metadata = {
  title: "Accommodations",
  description: "Hotels, experiences, and travel packages for FIFA World Cup 2026.",
};

const PACKAGES = [
  {
    title: "Premium Hotel Package",
    description: "4-star hotel near stadium, breakfast included, match-day shuttle.",
    from: 450,
  },
  {
    title: "Luxury Hotel + Match",
    description: "5-star hotel, hospitality match ticket, airport transfers.",
    from: 1200,
  },
  {
    title: "Full Trip Package",
    description: "Hotel, flights assistance, car rental, and match tickets bundled.",
    from: 2500,
  },
];

export default function AccommodationsPage() {
  return (
    <>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden">
        <Image
          src={SECTION_IMAGES.accommodations}
          alt="Luxury hotel accommodations"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001f54] via-[#003087]/60 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-32 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-200">Additional Offerings</p>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">Accommodations</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Select your preferred hotels, experiences, and/or car rentals to create your ideal
            World Cup 2026 trip package.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.title}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h2 className="text-xl font-bold text-[#003087]">{pkg.title}</h2>
              <p className="mt-3 flex-1 text-sm text-slate-600">{pkg.description}</p>
              <p className="mt-4 text-sm text-slate-500">
                From <strong className="text-lg text-slate-900">${pkg.from}</strong> USD / night
              </p>
              <Link
                href={`/accommodations?package=${encodeURIComponent(pkg.title)}#inquiry`}
                className="fifa-btn-primary mt-4 block rounded-lg py-2.5 text-center text-sm font-bold"
              >
                Buy Now
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">
          Need a custom package? Call{" "}
          <a href="tel:+18446521685" className="font-semibold text-[#003087]">
            +1-844-652-1685
          </a>
        </p>
      </section>
    </>
  );
}
