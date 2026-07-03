"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Invalid admin password");
        return;
      }
      onSuccess();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl"
      >
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
          <Lock className="h-6 w-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Admin Access</h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage payment settings, ticket prices, and sync live fixtures.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="mt-6 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
          required
        />
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Sign in
        </button>
      </form>
    </div>
  );
}
