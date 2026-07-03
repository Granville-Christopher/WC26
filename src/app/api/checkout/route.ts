import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";
import { getMatchBySlug } from "@/lib/fixtures";
import { saveOrder } from "@/lib/orders";
import type { SavedOrder } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const store = await readStore();
  const enabledMethods = store.payment.methods.filter((m) => m.enabled);
  return NextResponse.json(
    {
      payment: {
        currency: store.payment.currency,
        supportEmail: store.payment.supportEmail,
        checkoutNote: store.payment.checkoutNote,
        methods: enabledMethods,
      },
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    matchSlug: string;
    tierId: string;
    quantity: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    paymentMethodId: string;
  };

  if (!body.customerName?.trim() || !body.customerEmail?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const [store, match] = await Promise.all([
    readStore(),
    getMatchBySlug(body.matchSlug),
  ]);

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const tier = match.tickets.find((t) => t.id === body.tierId);
  if (!tier) {
    return NextResponse.json({ error: "Ticket tier not found" }, { status: 404 });
  }

  const method = store.payment.methods.find((m) => m.id === body.paymentMethodId && m.enabled);
  if (!method) {
    return NextResponse.json({ error: "Payment method not available" }, { status: 400 });
  }

  const orderRef = `CV-${Date.now().toString(36).toUpperCase()}`;
  const total = tier.price * body.quantity;

  const savedOrder: SavedOrder = {
    orderRef,
    createdAt: new Date().toISOString(),
    status: "pending",
    customerName: body.customerName.trim(),
    customerEmail: body.customerEmail.trim(),
    customerPhone: body.customerPhone?.trim() || undefined,
    matchSlug: body.matchSlug,
    matchTitle: match.title,
    matchDate: match.date,
    venue: match.venue,
    city: match.city,
    tierId: body.tierId as SavedOrder["tierId"],
    tierName: tier.name,
    quantity: body.quantity,
    unitPrice: tier.price,
    total,
    currency: store.payment.currency,
    paymentMethodId: method.id,
    paymentMethodLabel: method.label,
  };

  try {
    await saveOrder(savedOrder);
  } catch (error) {
    console.error("Failed to save order:", error);
    return NextResponse.json({ error: "Could not save order. Please try again." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    orderRef,
    total,
    currency: store.payment.currency,
    paymentMethod: method,
    checkoutNote: store.payment.checkoutNote,
    supportEmail: store.payment.supportEmail,
    match: { title: match.title, date: match.date, venue: match.venue },
    tier: { name: tier.name, price: tier.price, quantity: body.quantity },
  });
}
