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

  const baseTotal = 89.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const features = [
    "Aku bušilica za bušenje i odvijanje",
    "Aku brusilica za rezanje i brušenje",
    "2 punjive baterije za rad bez prekida",
    "Brzi punjač uključen u set",
    "Praktični kofer za nošenje i odlaganje",
    "Idealan za kuću, radionicu i teren",
    "3 godine garancije",
  ];

  const packageItems = [
    "1x DeWalt aku bušilica",
    "1x DeWalt aku brusilica",
    "2x punjive baterije",
    "1x punjač",
    "1x praktični kofer",
    "3 godine garancije",
  ];

  const testimonials = [
    "Za ove pare set je odličan. Bušilica i brusilica rade posao bez problema.",
    "Uzeo sam za kuću i radionicu, najviše mi znači što sve dođe u koferu.",
    "Dvije baterije su spas, ne moraš čekati da se puni da nastaviš posao.",
    "Brusilica mi je već prvi dan zatrebala, a bušilica je stalno u upotrebi.",
    "Garancija 3 godine me najviše uvjerila da naručim.",
  ];

  const faqs = [
    {
      q: "Šta dolazi u paketu?",
      a: "Dobijate aku bušilicu, aku brusilicu, 2 baterije, punjač i kofer.",
    },
    {
      q: "Da li je set dobar za kućnu upotrebu?",
      a: "Da, odličan je za kuću, garažu, vikendicu, radionicu i sitne majstorske poslove.",
    },
    {
      q: "Da li dolaze baterije?",
      a: "Da, u setu dobijate 2 punjive baterije i punjač.",
    },
    {
      q: "Ima li garanciju?",
      a: "Da, set dolazi sa 3 godine garancije.",
    },
    {
      q: "Koliko je ukupno sa dostavom?",
      a: "Set je 79,90 KM, dostava je 10,00 KM, ukupno 89,90 KM.",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "DeWalt 2u1 aku bušilica i aku brusilica set",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 79.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "dewalt-2u1",
    };

    if (!order.full_name || !order.phone || !order.address_place || !order.postal_code) {
      alert("Molimo popunite sva polja.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("orders").insert(order);

    if (error) {
      alert("Greška pri slanju narudžbe. Pokušajte ponovo.");
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
    <div className="min-h-screen bg-neutral-100 pb-10 text-black">
      <div className="mx-auto max-w-md overflow-hidden bg-white shadow-2xl">
        <section className="bg-gradient-to-b from-yellow-400 via-yellow-300 to-neutral-900 px-4 pb-6 pt-5 text-black">
          <div className="rounded-2xl bg-black px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-yellow-300 shadow-lg">
            ✅ 3 GODINE GARANCIJE
          </div>

          <h1 className="mt-4 text-center text-3xl font-black leading-tight">
            DeWalt 2u1 aku set
          </h1>

          <p className="mt-2 text-center text-sm font-bold">
            Aku bušilica + aku brusilica + 2 baterije + punjač + kofer
          </p>

          <div className="mt-4 rounded-[28px] bg-white p-3 shadow-2xl">
            <img
              src="https://i.imgur.com/9qQrXlh.png"
              alt="DeWalt 2u1 aku set"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-4 rounded-2xl bg-red-600 px-4 py-3 text-center text-white shadow-lg">
            <div className="text-xs font-black uppercase tracking-wide">Najveća akcija do sada</div>
            <div className="mt-1 text-2xl font-black">Skoro pa džaba – 79,90 KM</div>
          </div>

          <button
            type="button"
            onClick={scrollToOrder}
            className="mt-4 block w-full rounded-2xl bg-black px-5 py-4 text-center text-base font-black uppercase tracking-wide text-yellow-300 shadow-xl"
          >
            Naruči odmah
          </button>
        </section>

        <main className="px-4 py-5">
          <section className="rounded-3xl border border-yellow-300 bg-yellow-50 p-4">
            <h2 className="text-lg font-black text-neutral-900">
              🔧 Dva najpotrebnija alata u jednom koferu
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Ako ti stalno zatreba bušilica za montažu, popravku ili kućne radove, a brusilica za
              rezanje i brušenje — ovaj DeWalt 2u1 set rješava sve odjednom. Bez kupovine odvojeno,
              bez dodatnog traženja baterija i punjača.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-yellow-200">
            <div className="mb-3 rounded-2xl bg-yellow-100 px-4 py-3 text-center text-sm font-black text-black ring-1 ring-yellow-300">
              🛡️ GARANCIJA 3 GODINE
            </div>

            <h2 className="text-xl font-black">✅ Zašto se ovaj set isplati?</h2>
            <div className="mt-4 space-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-yellow-300 bg-yellow-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ✅ {feature}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4">
            <h2 className="text-base font-black text-red-700">
              ❌ Ne čekaj da ti alat zatreba kad ga nemaš
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Jedan dan trebaš izbušiti zid, drugi dan odrezati metal, treći dan nešto sastaviti.
              Sa ovim setom imaš bušilicu i brusilicu spremne u koferu — uvijek pri ruci.
            </p>
          </section>

          <section className="mt-5 rounded-3xl border border-yellow-300 bg-yellow-50 p-5">
            <h2 className="text-xl font-black">📦 Šta dolazi u paketu?</h2>
            <div className="mt-4 space-y-2">
              {packageItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white p-3 text-sm font-semibold text-neutral-800 shadow-sm"
                >
                  ✔ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-neutral-900 p-5 text-white shadow-sm">
            <h2 className="text-xl font-black text-yellow-300">💥 Za koga je ovaj set?</h2>
            <div className="mt-4 space-y-3">
              {[
                "Za domaćine koji vole sami završiti posao",
                "Za majstore i montažere",
                "Za garažu, kuću, radionicu i vikendicu",
                "Za sve koji žele ozbiljan set po niskoj cijeni",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-3 text-sm font-semibold">
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-yellow-200">
            <h2 className="text-xl font-black">💬 Iskustva kupaca</h2>
            <div className="mt-4 space-y-3">
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <p className="text-sm leading-6 text-neutral-700">“{item}”</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-yellow-300 bg-yellow-100 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-neutral-900">
              🔥 AKCIJA 79,90 KM • GARANCIJA 3 GODINE
            </div>
            <div className="mt-1 text-xs font-semibold text-neutral-700">
              Količine su ograničene. Kada se rasproda, cijena se vraća.
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-yellow-300 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Najčešća pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                  <h3 className="text-sm font-black text-neutral-900">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            ref={orderRef}
            className="mt-5 rounded-3xl bg-gradient-to-b from-neutral-900 to-black p-5 text-white shadow-2xl"
          >
            <div className="mb-3 rounded-2xl bg-yellow-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-black shadow-lg">
              ✅ GARANCIJA 3 GODINE
            </div>

            <h2 className="text-center text-2xl font-black">📋 Naruči odmah</h2>
            <p className="mt-2 text-center text-sm text-neutral-300">
              Ostavi podatke i naš tim će te kontaktirati
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                name="ime"
                autoComplete="off"
                placeholder="Ime i prezime"
                className="w-full rounded-2xl border-2 border-yellow-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="telefon"
                autoComplete="off"
                placeholder="Broj telefona"
                className="w-full rounded-2xl border-2 border-yellow-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="adresa"
                autoComplete="off"
                placeholder="Adresa i mjesto"
                className="w-full rounded-2xl border-2 border-yellow-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="postanski"
                autoComplete="off"
                placeholder="Poštanski broj"
                className="w-full rounded-2xl border-2 border-yellow-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />

              <label className="flex gap-3 rounded-2xl border border-yellow-300 bg-yellow-100 p-3 text-black">
                <input
                  type="checkbox"
                  checked={giftPack}
                  onChange={(e) => setGiftPack(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-bold">Želim poklon paket</div>
                  <div className="text-xs">+5,00 KM (vrijednost do 50,00 KM)</div>
                </div>
              </label>

              <div className="rounded-2xl border-2 border-yellow-400 bg-white p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>DeWalt 2u1 set</span>
                  <span>79,90 KM</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Dostava</span>
                  <span>10,00 KM</span>
                </div>
                {giftPack && (
                  <div className="mt-1 flex justify-between text-sm text-yellow-700">
                    <span>Poklon paket</span>
                    <span>5,00 KM</span>
                  </div>
                )}
                <div className="mt-3 border-t pt-3">
                  <div className="flex justify-between text-lg font-black">
                    <span>Ukupno</span>
                    <span>{total.toFixed(2)} KM</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-yellow-400 p-4 text-lg font-black uppercase tracking-wide text-black shadow-lg disabled:opacity-70"
              >
                {loading ? "Šalje se..." : "Naruči odmah"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}