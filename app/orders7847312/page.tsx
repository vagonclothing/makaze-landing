"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  novo:        { bg: "bg-gray-100",   text: "text-gray-600",  label: "🕐 Novo" },
  potvrdjena:  { bg: "bg-green-100",  text: "text-green-700", label: "✅ Potvrđena" },
  odgodjena:   { bg: "bg-red-100",    text: "text-red-700",   label: "⏸ Odgođena" },
  otkucano:    { bg: "bg-blue-100",   text: "text-blue-700",  label: "📦 Otkucano" },
};

const CARD_BORDER: Record<string, string> = {
  novo:        "border-gray-200",
  potvrdjena:  "border-green-400",
  odgodjena:   "border-red-400",
  otkucano:    "border-blue-400",
};

export default function OrdersPage() {
  const [orders, setOrders]     = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter]     = useState("sve");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setOrders(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    }
    setUpdating(null);
  }

  const FILTERS = ["sve", "novo", "potvrdjena", "otkucano", "odgodjena"];

  const filtered = filter === "sve"
    ? orders
    : orders.filter((o) => (o.status || "novo") === filter);

  const counts: Record<string, number> = { sve: orders.length };
  FILTERS.slice(1).forEach((f) => {
    counts[f] = orders.filter((o) => (o.status || "novo") === f).length;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-black text-black">Narudžbe</h1>
          <a
            href="/dashboard"
            className="rounded-lg bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
          >
            📊 Dashboard
          </a>
        </div>

        {/* Filter tabs */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((f) => {
            const s = STATUS_STYLES[f];
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  filter === f
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {f === "sve" ? "🗂 Sve" : s?.label} ({counts[f] ?? 0})
              </button>
            );
          })}
        </div>

        {loading && <p className="text-gray-500">Učitavanje...</p>}

        <div className="space-y-3">
          {filtered.map((o) => {
            const status = o.status || "novo";
            const s = STATUS_STYLES[status] ?? STATUS_STYLES.novo;
            const border = CARD_BORDER[status] ?? CARD_BORDER.novo;

            return (
              <div
                key={o.id}
                className={`rounded-xl bg-white p-4 text-black shadow border-2 ${border}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm text-gray-500">
                      {new Date(o.created_at).toLocaleString("bs-BA")}
                    </div>
                    <div className="mt-1 text-lg font-bold text-black">{o.full_name}</div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${s.bg} ${s.text}`}>
                    {s.label}
                  </span>
                </div>

                <div className="mt-2 text-black">📞 {o.phone}</div>
                <div className="text-black">📍 {o.address_place}</div>
                <div className="text-black">📮 {o.postal_code}</div>

                {o.product_name && (
                  <div className="mt-2 font-semibold text-black">🛒 {o.product_name}</div>
                )}
                {o.source && (
                  <div className="text-sm text-gray-500">🔗 {o.source}</div>
                )}

                <div className="mt-2 font-bold text-black">💰 {o.total} KM</div>

                {o.gift_pack && (
                  <div className="mt-1 font-bold text-green-700">🎁 Poklon paket</div>
                )}

                {/* Action buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStatus(o.id, "potvrdjena")}
                    disabled={status === "potvrdjena" || updating === o.id}
                    className="rounded-lg bg-green-500 py-2.5 text-sm font-bold text-white transition hover:bg-green-600 disabled:opacity-40"
                  >
                    ✅ Potvrdi
                  </button>
                  <button
                    onClick={() => updateStatus(o.id, "otkucano")}
                    disabled={status === "otkucano" || updating === o.id}
                    className="rounded-lg bg-blue-500 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-40"
                  >
                    📦 Otkucaj
                  </button>
                  <button
                    onClick={() => updateStatus(o.id, "odgodjena")}
                    disabled={status === "odgodjena" || updating === o.id}
                    className="rounded-lg bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-40"
                  >
                    ⏸ Odgodi
                  </button>
                  <button
                    onClick={() => updateStatus(o.id, "novo")}
                    disabled={status === "novo" || updating === o.id}
                    className="rounded-lg bg-gray-200 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-300 disabled:opacity-40"
                  >
                    🔄 Resetuj
                  </button>
                </div>
              </div>
            );
          })}

          {!loading && filtered.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center text-gray-400 font-semibold">
              Nema narudžbi u ovoj kategoriji.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}