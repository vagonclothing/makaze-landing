"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const baseTotal = 27.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const scrollToOrder = () => {
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const benefits = [
    "Smanjuje temperaturu u vozilu i do 30°C",
    "Štiti sjedišta, plastiku i elektroniku od sunca",
    "Jednostavno se sklapa i ne zauzima prostor",
    "Univerzalna veličina – odgovara većini automobila",
    "Dobijate 1+1 GRATIS po akcijskoj cijeni",
  ];

  const testimonials = [
    "Nisam više morao čekati pet minuta da rashladim auto prije vožnje. Kišobran stvarno pomaže! — Adnan M., Sarajevo",
    "Prije su mi djeca izbjegavala ulaziti u auto po vrućini, sad jedva čekaju. — Jasmina K., Tuzla",
    "Auto mi je stalno parkiran na suncu ispred firme i ovaj kišobran je bukvalno spas. — Enes R., Banja Luka",
    "Temperatura u autu je znatno niža i ne znojim se više čim sjednem. — Lejla D., Zenica",
    "Ovaj kišobran mi je sačuvao ekran na konzoli, koji se ranije često pregrijavao. — Tarik S., Mostar",
    "Koristim ga svakodnevno. Kad otvorim vrata, ne udara me više vreli zrak. — Damir H., Bihać",
  ];

  const details = [
    "Reflektirajući višeslojni tekstil",
    "Metalna konstrukcija",
    "Univerzalna veličina",
    "Težina: 320 g",
    "Sklopivi dizajn poput običnog kišobrana",
    "Pogodno za automobile, SUV vozila i kombije",
    "Uključuje zaštitnu torbicu",
  ];

  const faqs = [
    {
      q: "Kako se koristi auto kišobran?",
      a: "Otvori se kao običan kišobran i postavi sa unutrašnje strane vjetrobranskog stakla.",
    },
    {
      q: "Da li odgovara svim vozilima?",
      a: "Univerzalna veličina odgovara većini automobila, SUV vozila i kombija.",
    },
    {
      q: "Štiti li od UV zraka i toplote?",
      a: "Da, reflektirajući materijal odbija sunčeve zrake i smanjuje zagrijavanje unutrašnjosti.",
    },
    {
      q: "Koliko prostora zauzima kad se sklopi?",
      a: "Vrlo malo. Kada se sklopi, izgleda kao običan kišobran i lako se odloži.",
    },
    {
      q: "Da li može na zadnje staklo?",
      a: "Primarno je namijenjen za prednje vjetrobransko staklo.",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "Auto kišobran zaštita od sunca 1+1 gratis",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 17.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "auto-kisobran",
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
    <div className="min-h-screen bg-orange-50 pb-10 text-black">
      <div className="mx-auto max-w-md overflow-hidden bg-white shadow-2xl">
        <section className="bg-gradient-to-b from-orange-500 via-amber-400 to-yellow-300 px-4 pb-6 pt-5 text-black">
          <div className="rounded-2xl bg-black px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-white shadow-lg">
            🔥 1+1 GRATIS AKCIJA
          </div>

          <h1 className="mt-4 text-center text-3xl font-black leading-tight">
            Auto kišobran za zaštitu od sunca
          </h1>

          <p className="mt-2 text-center text-sm font-bold">
            Pametna zaštita unutrašnjosti vozila od vrućine, UV zraka i pregrijavanja
          </p>

          <div className="mt-4 rounded-[28px] bg-white p-3 shadow-2xl">
            <img
              src="https://i.imgur.com/CcVTxn2.png"
              alt="Auto kišobran"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/80 p-3 text-center shadow-lg">
              <div className="text-[11px] font-black uppercase tracking-wide text-neutral-700">
                Regularna cijena
              </div>
              <div className="mt-1 text-xl font-black line-through">30,00 KM</div>
              <div className="text-xs font-bold">za 1 komad</div>
            </div>

            <div className="rounded-2xl bg-black p-3 text-center text-white shadow-lg">
              <div className="text-[11px] font-black uppercase tracking-wide text-yellow-300">
                Danas
              </div>
              <div className="mt-1 text-2xl font-black">17,90 KM</div>
              <div className="text-xs font-bold">1+1 GRATIS</div>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToOrder}
            className="mt-4 block w-full rounded-2xl bg-black px-5 py-4 text-center text-base font-black uppercase tracking-wide text-white shadow-xl"
          >
            Naruči 1+1 gratis
          </button>
        </section>

        <main className="px-4 py-5">
          <section className="rounded-3xl border border-orange-200 bg-orange-50 p-4">
            <h2 className="text-lg font-black text-orange-800">
              ☀️ Auto kao rerna poslije 10 minuta na suncu?
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Vruć zrak, užarena sjedišta, vrela plastika i pregrijana elektronika. Auto kišobran
              se postavlja za par sekundi i pomaže da vozilo ostane svježije i zaštićenije.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100">
            <h2 className="text-xl font-black">✅ Zašto ga vozači uzimaju?</h2>
            <div className="mt-4 space-y-3">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
            <img
              src="https://i.imgur.com/BvXafcv.png"
              alt="Prije i poslije"
              className="w-full rounded-2xl object-cover"
            />
          </section>

          <section className="mt-5 rounded-3xl border border-yellow-300 bg-yellow-100 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-neutral-900">
              🚗 1+1 GRATIS – dobijaš dva komada po akcijskoj cijeni
            </div>
            <div className="mt-1 text-xs font-semibold text-neutral-700">
              Jedan za sebe, drugi za drugi auto ili kao poklon.
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-orange-100">
            <img
              src="https://i.imgur.com/sCb6XaT.jpeg"
              alt="Automehaničar"
              className="w-full rounded-2xl object-cover"
            />
            <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
              <h2 className="text-lg font-black">🧑‍🔧 Izjava automehaničara</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                “Redovno viđam štetu koju visoke temperature i UV zrake nanose unutrašnjosti
                vozila – izblijedjela plastika, oštećena sjedišta i pregrijane elektronske
                komponente. Auto kišobran je jednostavno rješenje koje štiti enterijer i snižava
                temperaturu u kabini.”
              </p>
              <p className="mt-2 text-sm font-black text-orange-700">
                — Marko Petrović, automehaničar
              </p>
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-orange-100">
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

          <section className="mt-5 rounded-3xl border border-orange-200 bg-orange-50 p-5">
            <h2 className="text-xl font-black">📦 Detalji proizvoda</h2>
            <div className="mt-4 space-y-2">
              {details.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white p-3 text-sm font-semibold text-neutral-800 shadow-sm"
                >
                  ✔ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-orange-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Najčešća pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                  <h3 className="text-sm font-black text-orange-800">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            ref={orderRef}
            className="mt-5 rounded-3xl bg-gradient-to-b from-orange-500 to-amber-400 p-5 text-black shadow-2xl"
          >
            <div className="mb-3 rounded-2xl bg-black px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-white shadow-lg">
              🔥 Naruči 1+1 gratis
            </div>

            <h2 className="text-center text-2xl font-black">📋 Forma za narudžbu</h2>
            <p className="mt-2 text-center text-sm font-bold">
              Brza dostava na kućnu adresu
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                name="ime"
                autoComplete="off"
                placeholder="Ime i prezime"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="telefon"
                autoComplete="off"
                placeholder="Broj telefona"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="adresa"
                autoComplete="off"
                placeholder="Adresa i mjesto"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="postanski"
                autoComplete="off"
                placeholder="Poštanski broj"
                className="w-full rounded-2xl border-2 border-orange-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
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
                  <div className="text-xs">+5,00 KM</div>
                </div>
              </label>

              <div className="rounded-2xl border-2 border-black bg-white p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>Auto kišobran 1+1 gratis</span>
                  <span>17,90 KM</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Poštarina</span>
                  <span>10,00 KM</span>
                </div>
                {giftPack && (
                  <div className="mt-1 flex justify-between text-sm text-orange-700">
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
                className="w-full rounded-2xl bg-black p-4 text-lg font-black uppercase tracking-wide text-white shadow-lg disabled:opacity-70"
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