import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getLiveMatches } from "@/lib/fixtures";
import { readStore, writeStore } from "@/lib/store";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [{ matches }, store] = await Promise.all([getLiveMatches(), readStore()]);

  const enriched = matches.map((m) => ({
    slug: m.slug,
    matchNumber: m.matchNumber,
    title: m.title,
    date: m.date,
    stage: m.stage,
    city: m.city,
    country: m.country,
    prices: m.tickets.reduce(
      (acc, t) => {
        acc[t.id] = t.price;
        return acc;
      },
      {} as Record<string, number>
    ),
    stock: m.tickets.reduce(
      (acc, t) => {
        acc[t.id] = t.quantity;
        return acc;
      },
      {} as Record<string, number>
    ),
  }));

  return NextResponse.json({ matches: enriched, defaults: store.tierPrices.default });
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    slug: string;
    prices?: Record<string, number>;
    stock?: Record<string, number>;
    updateDefaults?: boolean;
  };

  try {
    const store = await readStore();

    if (body.updateDefaults && body.prices) {
      store.tierPrices.default = { ...store.tierPrices.default, ...body.prices };
    }
    if (body.updateDefaults && body.stock) {
      store.tierStock.default = { ...store.tierStock.default, ...body.stock };
    }

    if (body.slug && body.prices) {
      store.tierPrices.byMatchSlug[body.slug] = {
        ...store.tierPrices.byMatchSlug[body.slug],
        ...body.prices,
      };
    }
    if (body.slug && body.stock) {
      store.tierStock.byMatchSlug[body.slug] = {
        ...store.tierStock.byMatchSlug[body.slug],
        ...body.stock,
      };
    }

    await writeStore(store);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save prices:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error:
          "Could not save. Storage is not writable — on Vercel, link a Blob store (Storage → Blob) so BLOB_READ_WRITE_TOKEN is set, then redeploy.",
        detail: message,
      },
      { status: 500 }
    );
  }
}
