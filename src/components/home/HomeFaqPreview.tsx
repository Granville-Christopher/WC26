import Link from "next/link";

const FAQ_PREVIEW = [
  {
    q: "How is hospitality different from a general ticket?",
    a: "Hospitality packages include premium seating, exclusive entertainment, and upscale food and beverages — an elevated experience beyond standard event offerings.",
  },
  {
    q: "Can I buy hospitality packages from other companies?",
    a: "Ticket-inclusive hospitality packages are sold exclusively through official channels. We strongly advise against unauthorized platforms or sellers.",
  },
  {
    q: "Why are prices different for each match?",
    a: "FIFA uses dynamic pricing — prices vary by match, stage, teams, venue, and demand. Each match has its own starting price.",
  },
];

export function HomeFaqPreview() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {FAQ_PREVIEW.map((item) => (
            <details key={item.q} className="rounded-lg border border-slate-200 bg-[#f4f5f7]">
              <summary className="cursor-pointer px-5 py-4 font-semibold text-slate-900">
                {item.q}
              </summary>
              <p className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/faq" className="text-sm font-bold text-[#003087] hover:underline">
            See All FAQs →
          </Link>
        </div>
      </div>
    </section>
  );
}
