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
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-black mb-4">Narudžbe</h1>

      {loading && <p>Učitavanje...</p>}

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-white p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500">
              {new Date(o.created_at).toLocaleString()}
            </div>

            <div className="font-bold text-lg">{o.full_name}</div>

            <div>📞 {o.phone}</div>
            <div>📍 {o.address_place}</div>
            <div>📮 {o.postal_code}</div>

            <div className="mt-2">
              💰 {o.total} KM
            </div>

            {o.gift_pack && (
              <div className="text-green-600 font-bold">
                🎁 Poklon paket
              </div>
            )}

            <div className="mt-2 text-xs bg-gray-200 inline-block px-2 py-1 rounded">
              Status: {o.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
