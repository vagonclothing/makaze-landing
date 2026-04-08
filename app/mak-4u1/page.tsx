"use client";

import { useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Page() {
  const [giftPack, setGiftPack] = useState(false);
  const [loading, setLoading] = useState(false);

  const baseTotal = 189.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "Makita 4u1 aku set",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 179.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "makita-set",
    };

    if (!order.full_name || !order.phone || !order.address_place || !order.postal_code) {
      alert("Molimo popunite sva polja.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("orders").insert(order);

    if (error) {
      alert("Greška pri slanju narudžbe.");
      setLoading(false);
      return;
    }

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Lead", {
        content_name: order.product_name,
        value: order.total,
        currency: "BAM",
      });
    }

    alert("Narudžba uspješno poslana!");
    form.reset();
    setGiftPack(false);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24 text-black">
      <div className="mx-auto max-w-md bg-white shadow-2xl">

        {/* HEADER */}
        <section className="bg-gradient-to-b from-green-800 to-green-600 p-4 text-white">

          <div className="flex justify-center mb-3">
            <img src="https://i.imgur.com/lSbB2fv.png" className="h-10" />
          </div>

          <div className="bg-yellow-400 text-black font-black text-center py-2 rounded-xl">
            ✅ 3 GODINE GARANCIJA
          </div>

          <h1 className="text-center text-2xl font-black mt-3">
            MAKITA 4u1 AKU SET
          </h1>

          <p className="text-center mt-1 text-sm">
            4 alata + 4 baterije + kofer
          </p>

          <img
            src="https://i.imgur.com/Rt922x2.png"
            className="mt-4 rounded-xl"
          />

          <div className="flex gap-2 mt-4">
            <div className="bg-black text-white p-3 rounded-xl text-center w-1/2">
              <div className="text-xs">Redovna</div>
              <div className="line-through font-bold">499 KM</div>
            </div>

            <div className="bg-yellow-400 text-black p-3 rounded-xl text-center w-1/2 font-black">
              179,90 KM
            </div>
          </div>

          <a href="#narudzba" className="block mt-4 bg-yellow-400 text-black text-center p-3 rounded-xl font-black">
            NARUČI ODMAH
          </a>
        </section>

        {/* BENEFITS */}
        <div className="p-4 space-y-3">
          <div className="bg-green-50 p-3 rounded-xl">✅ Udarni odvijač</div>
          <div className="bg-green-50 p-3 rounded-xl">✅ Aku bušilica</div>
          <div className="bg-green-50 p-3 rounded-xl">✅ Brusilica</div>
          <div className="bg-green-50 p-3 rounded-xl">✅ SDS hilti</div>
          <div className="bg-green-50 p-3 rounded-xl">🔋 4 baterije</div>
          <div className="bg-green-50 p-3 rounded-xl">⚡ Brzi punjač</div>
        </div>

        {/* IMAGE */}
        <div className="p-4">
          <img src="https://i.imgur.com/oPyfDvA.png" className="rounded-xl" />
        </div>

        {/* TESTIMONIAL */}
        <div className="p-4 bg-gray-50 rounded-xl mx-4">
          <p>
            “Imate 4 alata koji rade odlično, baterije traju, a sve u koferu.”
          </p>
          <b>— Nedžad M.</b>
        </div>

        {/* ORDER */}
        <div id="narudzba" className="p-4 bg-green-700 text-white mt-5">

          <div className="bg-yellow-400 text-black text-center font-black py-2 rounded-xl mb-3">
            🔥 3 GODINE GARANCIJA
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input name="ime" placeholder="Ime i prezime" className="w-full p-3 text-black rounded-xl" />
            <input name="telefon" placeholder="Telefon" className="w-full p-3 text-black rounded-xl" />
            <input name="adresa" placeholder="Adresa" className="w-full p-3 text-black rounded-xl" />
            <input name="postanski" placeholder="Poštanski broj" className="w-full p-3 text-black rounded-xl" />

            <label className="flex gap-2">
              <input type="checkbox" checked={giftPack} onChange={(e)=>setGiftPack(e.target.checked)} />
              Poklon paket +5 KM
            </label>

            <div className="bg-white text-black p-3 rounded-xl">
              <div>Set: 179,90 KM</div>
              <div>Dostava: 10 KM</div>
              {giftPack && <div>Poklon: 5 KM</div>}
              <b>Ukupno: {total.toFixed(2)} KM</b>
            </div>

            <button className="w-full bg-yellow-400 text-black p-3 rounded-xl font-black">
              {loading ? "Šalje se..." : "Naruči"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}