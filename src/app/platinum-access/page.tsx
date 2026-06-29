import { PlatinumHero, PlatinumRegisterForm } from "@/components/platinum/PlatinumPage";

export const metadata = {
  title: "Platinum Access",
  description: "Register interest for FIFA World Cup 2026 Platinum Access hospitality.",
};

export default function PlatinumAccessPage() {
  return (
    <>
      <PlatinumHero />
      <section className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
        <p className="mb-8 text-slate-600">
          Platinum Access is available by inquiry only. Register below or call{" "}
          <a href="tel:+18446521685" className="font-semibold text-[#003087]">
            +1-844-652-1685
          </a>
          .
        </p>
        <PlatinumRegisterForm />
      </section>
    </>
  );
}
