import { NextResponse } from "next/server";
import { readStore } from "@/lib/store";
import { getMatchBySlug } from "@/lib/fixtures";

export async function GET() {
  const store = await readStore();
  const enabledMethods = store.payment.methods.filter((m) => m.enabled);
  return NextResponse.json({
    payment: {
      currency: store.payment.currency,
      supportEmail: store.payment.supportEmail,
      checkoutNote: store.payment.checkoutNote,
      methods: enabledMethods,
    },
  });
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
