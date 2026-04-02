"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }

      setLoading(false);
    }

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-2xl font-black text-black">Narudžbe</h1>

        {loading && <p className="text-gray-700">Učitavanje...</p>}

        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o.id}
              className="rounded-xl bg-white p-4 text-black shadow border border-gray-200"
            >
              <div className="text-sm text-gray-700">
                {new Date(o.created_at).toLocaleString()}
              </div>

              <div className="mt-1 text-lg font-bold text-black">{o.full_name}</div>

              <div className="mt-2 text-black">📞 {o.phone}</div>
              <div className="text-black">📍 {o.address_place}</div>
              <div className="text-black">📮 {o.postal_code}</div>

              {o.product_name && (
                <div className="mt-2 font-semibold text-black">
                  🛒 Proizvod: {o.product_name}
                </div>
              )}

              {o.source && (
                <div className="text-sm text-gray-700">
                  🔗 Izvor: {o.source}
                </div>
              )}

              <div className="mt-2 font-bold text-black">
                💰 {o.total} KM
              </div>

              {o.gift_pack && (
                <div className="mt-2 font-bold text-green-700">
                  🎁 Poklon paket
                </div>
              )}

              <div className="mt-3 inline-block rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-black">
                Status: {o.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}