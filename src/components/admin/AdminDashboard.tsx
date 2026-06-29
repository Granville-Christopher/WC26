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
  Ticket,
} from "lucide-react";
import { HOSPITALITY_TIERS } from "@/data/tiers";
import type { PaymentMethod, PaymentSettings, StoreData } from "@/types";

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
  const [tab, setTab] = useState<"payment" | "prices" | "sync">("payment");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");
  const [payment, setPayment] = useState<PaymentSettings | null>(null);
  const [defaults, setDefaults] = useState<Record<string, number>>({});
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>("__default__");
  const [lastSync, setLastSync] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [settingsRes, matchesRes] = await Promise.all([
      fetch("/api/admin/settings"),
      fetch("/api/admin/matches"),
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
              <div key={method.id} className="rounded-2xl border border-white/10 bg-slate-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <input
                    value={method.label}
                    onChange={(e) => {
                      const methods = [...payment.methods];
                      methods[i] = { ...methods[i], label: e.target.value };
                      setPayment({ ...payment, methods });
                    }}
                    className="bg-transparent text-lg font-semibold outline-none"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={(e) => updateMethod(i, "enabled", e.target.checked)}
                    />
                    Enabled
                  </label>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(method.details).map(([key, val]) => (
                    <label key={key} className="block">
                      <span className="text-xs uppercase tracking-wider text-slate-500">{key}</span>
                      <input
                        value={String(val ?? "")}
                        onChange={(e) => updateMethod(i, key, e.target.value)}
                        className="mt-1 w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm"
                      />
                    </label>
                  ))}
                </div>
              </div>
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
