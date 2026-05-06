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

  const baseTotal = 99.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const benefits = [
    "Grijanje i hlađenje – dvije funkcije u jednom uređaju",
    "Daljinski upravljač – kontrola bez ustajanja",
    "Energetski efikasan rad – ušteda struje i novca",
    "Tihi rad – idealna za spavaće i radne prostorije",
    "Moderan i kompaktan dizajn",
    "Brza i jednostavna montaža",
  ];

  const packageItems = [
    "Zidna klima jedinica 2u1",
    "Daljinski upravljač",
    "Uputstvo za upotrebu",
    "Pribor za montažu",
    "Garancija na ispravnost",
  ];

  const testimonials = [
    {
      text: "Odlična klima, tiha i snažna. Kupili smo je zbog grijanja, ali sad je koristimo i ljeti za hlađenje. Super je što dolazi s daljinskim!",
      name: "Alma K., Sarajevo",
      images: ["https://i.imgur.com/aHSmpzH.jpeg", "https://i.imgur.com/0TFit1J.jpeg"],
    },
    {
      text: "Idealna za naš stan. Ne zauzima puno prostora, a sve funkcije su na daljinskom. Vrijedi svake marke!",
      name: "Faruk M., Mostar",
      images: ["https://i.imgur.com/avPaku8.jpeg"],
    },
    {
      text: "Grije brzo i ravnomjerno, čak i pri niskim temperaturama. Preporučujem!",
      name: "Milena S., Banja Luka",
      images: ["https://i.imgur.com/zj7YIIi.jpeg", "https://i.imgur.com/Ua6bvvX.jpeg"],
    },
    {
      text: "Nisam više morao uvoditi centralno – ova klima mi rješava sve. Plus je što izgleda moderno.",
      name: "Dragan K., Zenica",
      images: ["https://i.imgur.com/HGd0nzr.jpeg", "https://i.imgur.com/zmYye7b.jpeg"],
    },
    {
      text: "Uspjela sam je sama podesiti uz uputstvo. Daljinski je jednostavan, a klima radi tiho i učinkovito.",
      name: "Jovana D., Tuzla",
      images: ["https://i.imgur.com/NoGOuVA.jpeg", "https://i.imgur.com/YDrcCoF.jpeg"],
    },
  ];

  const faqs = [
    {
      q: "Kako funkcioniše klima 2u1?",
      a: "Klima ima funkciju grijanja i hlađenja. Preko daljinskog birate željeni režim rada.",
    },
    {
      q: "Koliko troši struje?",
      a: "Zahvaljujući energetski efikasnom radu, troši manje struje, naročito kada održava temperaturu.",
    },
    {
      q: "Može li grijati i kad je vani hladno?",
      a: "Da, pogodna je za stanove, kuće i manje poslovne prostore.",
    },
    {
      q: "Koliko je bučna?",
      a: "Radi tiho, pa je pogodna za spavaće sobe, kancelarije i radne prostore.",
    },
    {
      q: "Ko može montirati klimu?",
      a: "Može se montirati samostalno ako imate iskustva, ali preporučuje se stručna montaža.",
    },
    {
      q: "Ima li garanciju?",
      a: "Da. Uređaj ima garanciju na ispravnost i svaki uređaj se testira prije slanja.",
    },
    {
      q: "Koliko brzo stiže isporuka?",
      a: "Standardna dostava je 1–3 radna dana putem brze pošte.",
    },
    {
      q: "Može li se plaćati pouzećem?",
      a: "Da. Plaćate prilikom preuzimanja pošiljke.",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "Zidna klima 2u1 grije i hladi",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 89.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "zidna-klima",
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
    <div className="min-h-screen bg-sky-50 pb-10 text-black">
      <div className="mx-auto max-w-md overflow-hidden bg-white shadow-2xl">
        <section className="bg-gradient-to-b from-sky-600 via-cyan-500 to-orange-300 px-4 pb-6 pt-5 text-white">
          <div className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-sky-700 shadow-lg">
            ❄️🔥 Grije i hladi • Daljinski upravljač
          </div>

          <h1 className="mt-4 text-center text-3xl font-black leading-tight">
            Zidna klima 2u1 za svako godišnje doba
          </h1>

          <p className="mt-2 text-center text-sm font-bold text-white">
            Ugodno hlađenje ljeti i brzo grijanje zimi – bez velikih troškova
          </p>

          <div className="mt-4 rounded-[28px] bg-white p-3 shadow-2xl">
            <img
              src="https://i.imgur.com/uvszJ81.png"
              alt="Zidna klima 2u1"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-red-600 p-3 text-center text-white shadow-lg">
              <div className="text-[11px] font-bold uppercase tracking-wide text-red-100">
                Redovna cijena
              </div>
              <div className="mt-1 text-xl font-black line-through">299,99 KM</div>
            </div>

            <div className="rounded-2xl bg-yellow-400 p-3 text-center text-black shadow-lg ring-2 ring-white/40">
              <div className="text-[11px] font-bold uppercase tracking-wide">Akcija</div>
              <div className="mt-1 text-2xl font-black">89,90 KM</div>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToOrder}
            className="mt-4 block w-full rounded-2xl bg-white px-5 py-4 text-center text-base font-black uppercase tracking-wide text-sky-700 shadow-xl"
          >
            Naruči odmah
          </button>
        </section>

        <main className="px-4 py-5">
          <section className="rounded-3xl border border-sky-200 bg-sky-50 p-4">
            <h2 className="text-lg font-black text-sky-800">
              🌀 Jedan uređaj za hladne i vruće dane
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Zidna klima 2u1 je praktično rješenje za dom, stan, kancelariju ili poslovni prostor.
              Pruža efikasno grijanje zimi i ugodno hlađenje ljeti, a daljinski upravljač omogućava
              lako podešavanje temperature bez ustajanja.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
            <h2 className="text-xl font-black">✅ Glavne prednosti</h2>
            <div className="mt-4 space-y-3">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-sky-100">
            <img
              src="https://i.imgur.com/mvoQLZr.png"
              alt="Zidna klima prikaz 2"
              className="w-full rounded-2xl object-cover"
            />
          </section>

          <section className="mt-5 rounded-3xl border border-orange-200 bg-orange-50 p-4">
            <h2 className="text-lg font-black text-orange-800">
              🔥 Brzo grijanje, ❄️ ugodno hlađenje
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Umjesto da kupujete posebne uređaje za ljeto i zimu, ovaj model kombinuje obje
              funkcije. Idealan je za prostorije gdje želite brzo podešavanje temperature, tiši rad
              i moderan izgled.
            </p>
          </section>

          <section className="mt-5 rounded-3xl border border-sky-200 bg-sky-50 p-5">
            <h2 className="text-xl font-black">📦 U kompletu dolazi</h2>
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

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-sky-100">
            <img
              src="https://i.imgur.com/q4C1nPv.jpeg"
              alt="Serviser"
              className="w-full rounded-2xl object-cover"
            />
            <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
              <h2 className="text-lg font-black">👨‍🔧 Izjava profesionalca</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                “Kao serviser koji svakodnevno postavlja klime, ova 2u1 klima me iznenadila
                funkcijama. Grije brzo, hladi efikasno, a dolazi s odličnim daljinskim upravljačem.
                Kupci su prezadovoljni, a montaža je jednostavna i brza.”
              </p>
              <p className="mt-2 text-sm font-black text-sky-700">
                — Edin M., serviser
              </p>
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
            <h2 className="text-xl font-black">📸 Iskustva kupaca</h2>
            <div className="mt-4 space-y-4">
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                >
                  <p className="text-sm leading-6 text-neutral-700">“{item.text}”</p>
                  <p className="mt-2 text-sm font-black text-sky-700">— {item.name}</p>

                  {item.images.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {item.images.map((img) => (
                        <img
                          key={img}
                          src={img}
                          alt="Slika kupca"
                          className="h-32 w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-yellow-300 bg-yellow-100 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-neutral-900">
              ⚡ AKCIJA 89,90 KM • PLAĆANJE POUZEĆEM
            </div>
            <div className="mt-1 text-xs font-semibold text-neutral-700">
              Svaki uređaj se testira prije slanja. Dostava 1–3 radna dana.
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-sky-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Česta pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                  <h3 className="text-sm font-black text-sky-800">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            ref={orderRef}
            className="mt-5 rounded-3xl bg-gradient-to-b from-sky-700 to-cyan-600 p-5 text-white shadow-2xl"
          >
            <div className="mb-3 rounded-2xl bg-white px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-sky-700 shadow-lg">
              ❄️🔥 Naruči klima uređaj 2u1
            </div>

            <h2 className="text-center text-2xl font-black">📋 Forma za narudžbu</h2>
            <p className="mt-2 text-center text-sm text-sky-100">
              Plaćanje prilikom preuzimanja
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                name="ime"
                autoComplete="off"
                placeholder="Ime i prezime"
                className="w-full rounded-2xl border-2 border-sky-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="telefon"
                autoComplete="off"
                placeholder="Broj telefona"
                className="w-full rounded-2xl border-2 border-sky-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="adresa"
                autoComplete="off"
                placeholder="Adresa i mjesto"
                className="w-full rounded-2xl border-2 border-sky-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="postanski"
                autoComplete="off"
                placeholder="Poštanski broj"
                className="w-full rounded-2xl border-2 border-sky-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
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

              <div className="rounded-2xl border-2 border-white bg-white p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>Zidna klima 2u1</span>
                  <span>89,90 KM</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Dostava</span>
                  <span>10,00 KM</span>
                </div>
                {giftPack && (
                  <div className="mt-1 flex justify-between text-sm text-sky-700">
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
                className="w-full rounded-2xl bg-white p-4 text-lg font-black uppercase tracking-wide text-sky-700 shadow-lg disabled:opacity-70"
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