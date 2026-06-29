"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";
import type { PaymentMethod, PaymentSettings } from "@/types";
import type { WorldCupMatch, TierId } from "@/types";

interface CheckoutPageProps {
  match: WorldCupMatch;
  tierId: TierId;
}

export function CheckoutForm({ match, tierId }: CheckoutPageProps) {
  const tier = match.tickets.find((t) => t.id === tierId)!;
  const [payment, setPayment] = useState<PaymentSettings | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [methodId, setMethodId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{
    orderRef: string;
    total: number;
    paymentMethod: PaymentMethod;
    checkoutNote: string;
    supportEmail: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/checkout")
      .then((r) => r.json())
      .then((data) => {
        setPayment(data.payment);
        if (data.payment?.methods?.[0]) setMethodId(data.payment.methods[0].id);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchSlug: match.slug,
        tierId,
        quantity,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        paymentMethodId: methodId,
      }),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) setOrder(data);
  }

  if (order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-lg">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Order Received</h1>
          <p className="mt-2 text-slate-600">Reference: <strong>{order.orderRef}</strong></p>
          <p className="mt-4 text-lg font-semibold">
            Total: {formatPrice(order.total, match.currency)}
          </p>

          <div className="mt-8 rounded-xl bg-slate-50 p-6 text-left text-sm">
            <h3 className="font-semibold text-slate-900">Payment: {order.paymentMethod.label}</h3>
            {Object.entries(order.paymentMethod.details).map(([k, v]) =>
              v ? (
                <p key={k} className="mt-1 text-slate-600">
                  <span className="capitalize text-slate-500">{k.replace(/([A-Z])/g, " $1")}: </span>
                  {String(v)}
                </p>
              ) : null
            )}
            {order.checkoutNote && (
              <p className="mt-4 text-slate-600">{order.checkoutNote}</p>
            )}
            <p className="mt-4 text-slate-500">
              Questions? Contact{" "}
              <a href={`mailto:${order.supportEmail}`} className="text-emerald-600">
                {order.supportEmail}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-6">
      <Link href={`/events/${match.slug}`} className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600">
        <ArrowLeft className="h-4 w-4" />
        Back to match
      </Link>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Your selection</p>
            <h1 className="mt-2 text-xl font-bold text-slate-900">{tier.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{match.title}</p>
            <p className="mt-3 text-sm text-slate-600">
              {formatDate(match.date)} · {formatTime(match.time)}
            </p>
            <p className="text-sm text-slate-600">{match.venue}, {match.city}</p>
            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex justify-between text-sm">
                <span>{formatPrice(tier.price)} × {quantity}</span>
                <span className="font-bold">{formatPrice(tier.price * quantity, match.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"
              />
              <input
                placeholder="Phone (optional)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 sm:col-span-2"
              />
            </div>
            <label className="mt-4 block">
              <span className="text-sm text-slate-600">Quantity</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>{n} ticket{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">Payment method</h2>
            {!payment ? (
              <Loader2 className="mt-4 h-6 w-6 animate-spin text-emerald-500" />
            ) : (
              <div className="mt-4 space-y-2">
                {payment.methods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                      methodId === m.id ? "border-emerald-500 bg-emerald-50" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={m.id}
                      checked={methodId === m.id}
                      onChange={() => setMethodId(m.id)}
                    />
                    <span className="font-medium">{m.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !payment}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            Complete order — {formatPrice(tier.price * quantity, match.currency)}
          </button>
        </form>
      </div>
    </div>
  );
}
