"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  novo:        { bg: "bg-gray-100",   text: "text-gray-600",  label: "🕐 Novo" },
  potvrdjena:  { bg: "bg-green-100",  text: "text-green-700", label: "✅ Potvrđena" },
  odgodjena:   { bg: "bg-red-100",    text: "text-red-700",   label: "⏸ Odgođena" },
};

const CARD_BORDER: Record<string, string> = {
  novo:       "border-gray-200",
  potvrdjena: "border-green-400",
  odgodjena:  "border-red-400",
};

export default function OrdersPage() {
  const [orders, setOrders]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-black text-black">Narudžbe</h1>

        {loading && <p className="text-gray-700">Učitavanje...</p>}

        <div className="space-y-3">
          {orders.map((o) => {
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
                      {new Date(o.created_at).toLocaleString()}
                    </div>
                    <div className="mt-1 text-lg font-bold text-black">{o.full_name}</div>
                  </div>

                  {/* Status badge */}
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${s.bg} ${s.text}`}>
                    {s.label}
                  </span>
                </div>

                <div className="mt-2 text-black">📞 {o.phone}</div>
                <div className="text-black">📍 {o.address_place}</div>
                <div className="text-black">📮 {o.postal_code}</div>

                {o.product_name && (
                  <div className="mt-2 font-semibold text-black">
                    🛒 {o.product_name}
                  </div>
                )}

                {o.source && (
                  <div className="text-sm text-gray-500">🔗 {o.source}</div>
                )}

                <div className="mt-2 font-bold text-black">💰 {o.total} KM</div>

                {o.gift_pack && (
                  <div className="mt-1 font-bold text-green-700">🎁 Poklon paket</div>
                )}

                {/* Action buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => updateStatus(o.id, "potvrdjena")}
                    disabled={status === "potvrdjena" || updating === o.id}
                    className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-bold text-white transition hover:bg-green-600 disabled:opacity-40"
                  >
                    ✅ Potvrdi
                  </button>
                  <button
                    onClick={() => updateStatus(o.id, "odgodjena")}
                    disabled={status === "odgodjena" || updating === o.id}
                    className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-40"
                  >
                    ⏸ Odgodi
                  </button>
                  <button
                    onClick={() => updateStatus(o.id, "novo")}
                    disabled={status === "novo" || updating === o.id}
                    className="flex-1 rounded-lg bg-gray-200 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-300 disabled:opacity-40"
                  >
                    🔄 Resetuj
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}