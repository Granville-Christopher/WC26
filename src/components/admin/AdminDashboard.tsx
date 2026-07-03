"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CreditCard,
  DollarSign,
  Loader2,
  LogOut,
  RefreshCw,
  Save,
  Settings,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import { HOSPITALITY_TIERS } from "@/data/tiers";
import { AdminPaymentMethodCard } from "@/components/admin/AdminPaymentMethodCard";
import type { PaymentMethod, PaymentSettings, PlatinumInquiry, SavedOrder, StoreData } from "@/types";

interface AdminMatch {
  slug: string;
  matchNumber: number;
  title: string;
  date: string;
  stage: string;
  city: string;
  country: string;
  prices: Record<string, number>;
  stock: Record<string, number>;
}

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"payment" | "prices" | "orders" | "sync">("payment");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [payment, setPayment] = useState<PaymentSettings | null>(null);
  const [defaults, setDefaults] = useState<Record<string, number>>({});
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [inquiries, setInquiries] = useState<PlatinumInquiry[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("__default__");
  const [lastSync, setLastSync] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [settingsRes, matchesRes, ordersRes] = await Promise.all([
      fetch("/api/admin/settings"),
      fetch("/api/admin/matches"),
      fetch("/api/admin/orders"),
    ]);

    if (settingsRes.status === 401) {
      onLogout();
      return;
    }

    const settings = (await settingsRes.json()) as StoreData;
    const matchData = (await matchesRes.json()) as {
      matches: AdminMatch[];
      defaults: Record<string, number>;
    };

    setPayment(settings.payment);
    setLastSync(settings.lastFixtureSync);
    setMatches(matchData.matches);
    setDefaults(matchData.defaults);

    if (ordersRes.ok) {
      const ordersData = (await ordersRes.json()) as {
        orders: SavedOrder[];
        inquiries: PlatinumInquiry[];
      };
      setOrders(ordersData.orders);
      setInquiries(ordersData.inquiries);
    }

    setLoading(false);
  }, [onLogout]);

  useEffect(() => {
    load();
  }, [load]);

  async function savePayment() {
    if (!payment) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment }),
    });
    setSaving(false);
    setMessage(res.ok ? "Payment settings saved." : "Failed to save.");
  }

  async function savePrices() {
    setSaving(true);
    setMessage("");

    const tierIds = HOSPITALITY_TIERS.map((t) => t.id);
    const prices: Record<string, number> = {};
    const stock: Record<string, number> = {};

    tierIds.forEach((id) => {
      const priceEl = document.getElementById(`price-${id}`) as HTMLInputElement | null;
      const stockEl = document.getElementById(`stock-${id}`) as HTMLInputElement | null;
      if (priceEl) prices[id] = Number(priceEl.value);
      if (stockEl) stock[id] = Number(stockEl.value);
    });

    const body =
      selectedSlug === "__default__"
        ? { updateDefaults: true, slug: "", prices, stock }
        : { slug: selectedSlug, prices, stock };

    const res = await fetch("/api/admin/matches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("Prices updated successfully.");
      await load();
    } else {
      setMessage("Failed to update prices.");
    }
  }

  async function syncFixtures() {
    setSyncing(true);
    setMessage("");
    const res = await fetch("/api/fixtures", { method: "POST" });
    const data = await res.json();
    setSyncing(false);
    if (res.ok) {
      setMessage(`Synced ${data.count} matches from live source.`);
      setLastSync(data.syncedAt);
      await load();
    } else {
      setMessage("Fixture sync failed.");
    }
  }

  function updateMethod(index: number, field: string, value: string | boolean) {
    if (!payment) return;
    const methods = [...payment.methods];
    if (field === "enabled") {
      methods[index] = { ...methods[index], enabled: value as boolean };
    } else {
      methods[index] = {
        ...methods[index],
        details: { ...methods[index].details, [field]: value },
      };
    }
    setPayment({ ...payment, methods });
  }

  function addPaymentMethod() {
    if (!payment) return;
    setPayment({
      ...payment,
      methods: [
        ...payment.methods,
        {
          id: `method_${Date.now()}`,
          label: "New Payment Method",
          enabled: false,
          details: { instructions: "" },
        },
      ],
    });
  }

  const selectedMatch = matches.find((m) => m.slug === selectedSlug);
  const priceSource =
    selectedSlug === "__default__" ? defaults : selectedMatch?.prices ?? defaults;
  const stockSource =
    selectedSlug === "__default__"
      ? {}
      : selectedMatch?.stock ?? {};

  if (loading || !payment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">CupVault Admin</h1>
            <p className="text-sm text-slate-400">Payment, pricing & live fixtures</p>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "logout" }),
              });
              onLogout();
            }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex gap-2">
          {[
            { id: "payment" as const, label: "Payment", icon: CreditCard },
            { id: "prices" as const, label: "Ticket Prices", icon: DollarSign },
            { id: "orders" as const, label: "Orders & Leads", icon: ShoppingBag },
            { id: "sync" as const, label: "Live Fixtures", icon: RefreshCw },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                tab === id
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {tab === "payment" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Settings className="h-5 w-5 text-emerald-400" />
                Checkout Settings
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm text-slate-400">Currency</span>
                  <input
                    value={payment.currency}
                    onChange={(e) => setPayment({ ...payment, currency: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-400">Support Email</span>
                  <input
                    value={payment.supportEmail}
                    onChange={(e) => setPayment({ ...payment, supportEmail: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2"
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="text-sm text-slate-400">Checkout Note (shown to customers)</span>
                <textarea
                  value={payment.checkoutNote}
                  onChange={(e) => setPayment({ ...payment, checkoutNote: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2"
                />
              </label>
            </div>

            {payment.methods.map((method: PaymentMethod, i: number) => (
              <AdminPaymentMethodCard
                key={method.id}
                method={method}
                onUpdate={(field, value) => updateMethod(i, field, value)}
                onToggleEnabled={(enabled) => updateMethod(i, "enabled", enabled)}
                onLabelChange={(label) => {
                  const methods = [...payment.methods];
                  methods[i] = { ...methods[i], label };
                  setPayment({ ...payment, methods });
                }}
              />
            ))}

            <div className="flex gap-3">
              <button
                onClick={addPaymentMethod}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
              >
                + Add payment method
              </button>
              <button
                onClick={savePayment}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2 font-semibold hover:bg-emerald-500 disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save payment settings
              </button>
            </div>
          </div>
        )}

        {tab === "prices" && (
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Ticket className="h-5 w-5 text-emerald-400" />
              Ticket Tier Prices
            </h2>

            <label className="mb-6 block">
              <span className="text-sm text-slate-400">Edit prices for</span>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 md:w-96"
              >
                <option value="__default__">Default (all matches)</option>
                {matches.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    M{m.matchNumber}: {m.title} ({m.date})
                  </option>
                ))}
              </select>
            </label>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-slate-400">
                    <th className="pb-3 pr-4">Tier</th>
                    <th className="pb-3 pr-4">Category</th>
                    <th className="pb-3 pr-4">Price (USD)</th>
                    <th className="pb-3">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {HOSPITALITY_TIERS.map((tier) => (
                    <tr key={tier.id} className="border-b border-white/5">
                      <td className="py-3 pr-4 font-medium">{tier.name}</td>
                      <td className="py-3 pr-4 capitalize text-slate-400">{tier.category}</td>
                      <td className="py-3 pr-4">
                        <input
                          id={`price-${tier.id}`}
                          type="number"
                          defaultValue={priceSource[tier.id] ?? 0}
                          className="w-28 rounded-lg border border-white/10 bg-slate-800 px-2 py-1"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          id={`stock-${tier.id}`}
                          type="number"
                          defaultValue={stockSource[tier.id] ?? 8}
                          className="w-20 rounded-lg border border-white/10 bg-slate-800 px-2 py-1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={savePrices}
              disabled={saving}
              className="mt-6 flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold hover:bg-emerald-500 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save prices
            </button>
          </div>
        )}

        {tab === "orders" && (
          <div className="space-y-8">
            {orders.some((o) => o.proofOfPayment) && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
                <h2 className="mb-4 text-lg font-semibold text-amber-200">
                  Payment Proofs ({orders.filter((o) => o.proofOfPayment).length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {orders
                    .filter((o) => o.proofOfPayment)
                    .map((order) => (
                      <div
                        key={order.orderRef}
                        className="overflow-hidden rounded-xl border border-white/10 bg-slate-900"
                      >
                        {order.proofOfPayment?.contentType.startsWith("image/") ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={order.proofOfPayment.url}
                            alt={`Proof for ${order.orderRef}`}
                            className="h-40 w-full bg-white object-contain"
                          />
                        ) : (
                          <div className="flex h-40 items-center justify-center bg-slate-800 text-slate-400">
                            PDF document
                          </div>
                        )}
                        <div className="p-4 text-sm">
                          <p className="font-mono text-xs text-emerald-400">{order.orderRef}</p>
                          <p className="mt-1 font-medium">{order.customerName}</p>
                          <p className="text-slate-400">{order.paymentMethodLabel}</p>
                          <p className="mt-1 text-slate-500">
                            {order.currency} {order.total.toLocaleString()}
                          </p>
                          <a
                            href={order.proofOfPayment?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-xs font-semibold text-emerald-400 hover:underline"
                          >
                            Open full file →
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <ShoppingBag className="h-5 w-5 text-emerald-400" />
                Ticket Orders ({orders.length})
              </h2>
              {orders.length === 0 ? (
                <p className="text-sm text-slate-400">No orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left text-slate-400">
                        <th className="pb-3 pr-4">Reference</th>
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Customer</th>
                        <th className="pb-3 pr-4">Match</th>
                        <th className="pb-3 pr-4">Tickets</th>
                        <th className="pb-3 pr-4">Total</th>
                        <th className="pb-3 pr-4">Payment</th>
                        <th className="pb-3">Proof</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.orderRef} className="border-b border-white/5 align-top">
                          <td className="py-3 pr-4 font-mono text-xs">{order.orderRef}</td>
                          <td className="py-3 pr-4 whitespace-nowrap text-slate-300">
                            {new Date(order.createdAt).toLocaleString()}
                          </td>
                          <td className="py-3 pr-4">
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-slate-400">{order.customerEmail}</p>
                            {order.customerPhone && (
                              <p className="text-slate-500">{order.customerPhone}</p>
                            )}
                          </td>
                          <td className="py-3 pr-4">
                            <p>{order.matchTitle}</p>
                            <p className="text-slate-400">{order.matchDate}</p>
                            <p className="text-slate-500">{order.venue}, {order.city}</p>
                          </td>
                          <td className="py-3 pr-4">
                            {order.quantity}× {order.tierName}
                          </td>
                          <td className="py-3 pr-4 font-semibold">
                            {order.currency} {order.total.toLocaleString()}
                          </td>
                          <td className="py-3 pr-4 text-slate-300">{order.paymentMethodLabel}</td>
                          <td className="py-3">
                            {order.proofOfPayment ? (
                              <a
                                href={order.proofOfPayment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-emerald-400 hover:underline"
                              >
                                View proof
                              </a>
                            ) : (
                              <span className="text-slate-500">Not uploaded</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
              <h2 className="mb-4 text-lg font-semibold">Platinum Inquiries ({inquiries.length})</h2>
              {inquiries.length === 0 ? (
                <p className="text-sm text-slate-400">No platinum registrations yet.</p>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div
                      key={inquiry.id}
                      className="rounded-xl border border-white/10 bg-slate-800/50 p-4 text-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{inquiry.name}</p>
                          <p className="text-slate-400">{inquiry.email}</p>
                          {inquiry.phone && <p className="text-slate-500">{inquiry.phone}</p>}
                          {inquiry.company && <p className="text-slate-500">{inquiry.company}</p>}
                        </div>
                        <p className="text-xs text-slate-500">
                          {new Date(inquiry.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {inquiry.message && (
                        <p className="mt-3 rounded-lg bg-slate-900/80 p-3 text-slate-300">
                          {inquiry.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "sync" && (
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">
            <h2 className="mb-2 text-lg font-semibold">Live Fixture Sync</h2>
            <p className="mb-6 text-sm text-slate-400">
              Fixtures are fetched from the official openfootball World Cup 2026 schedule (mirrors
              FIFA tournament data) and refreshed hourly. Click sync to force an immediate update.
            </p>
            <div className="mb-6 rounded-xl bg-slate-800 p-4 text-sm">
              <p>
                <span className="text-slate-400">Matches loaded:</span>{" "}
                <strong>{matches.length}</strong>
              </p>
              <p className="mt-1">
                <span className="text-slate-400">Last sync:</span>{" "}
                {lastSync ? new Date(lastSync).toLocaleString() : "Never"}
              </p>
              <p className="mt-1">
                <span className="text-slate-400">Source:</span> openfootball/worldcup.json (2026)
              </p>
            </div>
            <button
              onClick={syncFixtures}
              disabled={syncing}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold hover:bg-emerald-500 disabled:opacity-50"
            >
              {syncing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Sync fixtures now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
