import { faqItems } from "@/data/faq";

export const metadata = {
  title: "FAQ — World Cup 2026 Tickets",
  description: "Answers to common questions about buying FIFA World Cup 2026 tickets on CupVault.",
};

export default function FAQPage() {
  const categories = [...new Set(faqItems.map((f) => f.category))];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 lg:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Frequently asked questions</h1>
      <p className="mt-2 text-gray-600">
        Everything you need to know about buying World Cup 2026 tickets.
      </p>

      <div className="mt-10 space-y-10">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="mb-4 text-lg font-semibold text-emerald-700">{category}</h2>
            <div className="space-y-4">
              {faqItems
                .filter((f) => f.category === category)
                .map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-gray-200 bg-white"
                  >
                    <summary className="cursor-pointer list-none px-5 py-4 font-medium text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
                      {item.question}
                    </summary>
                    <p className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
