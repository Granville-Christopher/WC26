import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readStore, writeStore } from "@/lib/store";
import type { PaymentSettings, StoreData } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const store = await readStore();
  return NextResponse.json({
    payment: store.payment,
    tierPrices: store.tierPrices,
    tierStock: store.tierStock,
    lastFixtureSync: store.lastFixtureSync,
  });
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    payment?: PaymentSettings;
    tierPrices?: StoreData["tierPrices"];
    tierStock?: StoreData["tierStock"];
  };

  try {
    const store = await readStore();
    if (body.payment) store.payment = body.payment;
    if (body.tierPrices) store.tierPrices = body.tierPrices;
    if (body.tierStock) store.tierStock = body.tierStock;
    await writeStore(store);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save settings:", error);
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
