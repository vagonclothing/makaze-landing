"use client";

import { useMemo, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Page() {
  const [giftPack, setGiftPack] = useState(false);
  const [loading, setLoading] = useState(false);
  const orderRef = useRef<HTMLElement | null>(null);

  const scrollToOrder = () => {
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const baseTotal = 79.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "Milwaukee aparat za zavarivanje inverter 500A",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 69.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "milwaukee-zavarivanje",
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

    if (window.fbq) {
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
    <div className="min-h-screen bg-neutral-100 text-black">
      <div className="mx-auto max-w-md bg-white shadow-2xl">

        {/* HERO */}
        <section className="bg-gradient-to-b from-red-800 via-red-700 to-red-600 px-4 pb-5 pt-4 text-white">
          <h1 className="text-center text-2xl font-black">
            MILWAUKEE APARAT ZA ZAVARIVANJE 500A
          </h1>

          <div className="mt-4">
            <img
              src="https://i.imgur.com/ckMdLH1.png"
              className="w-full rounded-2xl"
            />
          </div>

          <div className="mt-4 text-center">
            <div className="line-through">250,00 KM</div>
            <div className="text-2xl font-black">69,90 KM</div>
          </div>

          <button
            onClick={scrollToOrder}
            className="mt-4 w-full rounded-2xl bg-yellow-400 p-4 font-black text-black"
          >
            Naruči odmah
          </button>
        </section>

        {/* CONTENT */}
        <main className="p-4 space-y-4">
          <div className="bg-red-50 p-4 rounded-2xl">
            Profesionalni aparat za sve vrste zavarivanja.
          </div>
        </main>

        {/* ORDER */}
        <section
          ref={orderRef}
          className="p-4 bg-red-600 text-white rounded-t-3xl"
        >
          <h2 className="text-center text-xl font-black">Naruči odmah</h2>

          <form onSubmit={handleSubmit} className="space-y-3 mt-4">
            <input name="ime" placeholder="Ime i prezime" className="w-full p-4 rounded-xl text-black" />
            <input name="telefon" placeholder="Telefon" className="w-full p-4 rounded-xl text-black" />
            <input name="adresa" placeholder="Adresa" className="w-full p-4 rounded-xl text-black" />
            <input name="postanski" placeholder="Poštanski broj" className="w-full p-4 rounded-xl text-black" />

            <label className="flex gap-2 bg-yellow-100 p-3 rounded-xl text-black">
              <input
                type="checkbox"
                checked={giftPack}
                onChange={(e) => setGiftPack(e.target.checked)}
              />
              Poklon paket +5 KM
            </label>

            <div className="bg-white text-black p-4 rounded-xl">
              Ukupno: <b>{total.toFixed(2)} KM</b>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 p-4 rounded-xl font-black text-black"
            >
              {loading ? "Šalje se..." : "Naruči"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}