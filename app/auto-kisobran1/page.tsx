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

  const baseTotal = 27.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const benefits = [
    "Enterijer ostaje hladniji i prijatniji za ulazak",
    "Štiti armaturu, ekran, sjedišta i volan od sunca",
    "Postavlja se za nekoliko sekundi",
    "Sklapa se kao običan kišobran i lako se odlaže",
    "Odgovara većini automobila, SUV vozila i kombija",
    "Dobijaš 2 komada – 1+1 GRATIS",
  ];

  const details = [
    "Reflektirajući višeslojni materijal",
    "Čvrsta metalna konstrukcija",
    "Univerzalna veličina",
    "Težina: 320 g",
    "Brzo otvaranje i zatvaranje",
    "Za prednje vjetrobransko staklo",
    "Dolazi sa zaštitnom torbicom",
  ];

  const testimonials = [
    "Auto mi više nije kao pećnica kad sjednem poslije posla. Ogromna razlika. — Adnan M., Sarajevo",
    "Djeca se više ne žale da su sjedišta vrela. Stvarno praktična stvar. — Jasmina K., Tuzla",
    "Držim auto ispred firme na suncu i ovo mi je spasilo enterijer. — Enes R., Banja Luka",
    "Najbolje mi je što se sklopi kao kišobran i ne zauzima pola auta. — Lejla D., Zenica",
    "Volan i ekran se više ne pregrijavaju kao prije. Preporuka. — Tarik S., Mostar",
    "Mnogo praktičnije od običnih kartonskih sjenila. — Damir H., Bihać",
  ];

  const faqs = [
    {
      q: "Kako se koristi?",
      a: "Samo ga otvorite kao običan kišobran i postavite sa unutrašnje strane vjetrobranskog stakla.",
    },
    {
      q: "Da li odgovara mom autu?",
      a: "Univerzalna je veličina i odgovara većini automobila, SUV vozila i kombija.",
    },
    {
      q: "Da li stvarno smanjuje temperaturu?",
      a: "Da. Reflektirajući materijal odbija sunce i pomaže da kabina ostane osjetno hladnija.",
    },
    {
      q: "Koliko prostora zauzima?",
      a: "Vrlo malo. Kada se sklopi, izgleda kao običan kišobran i stane u vrata, pretinac ili ispod sjedišta.",
    },
    {
      q: "Kako se plaća?",
      a: "Plaćanje je pouzećem, tek kada preuzmete paket.",
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
    <div className="min-h-screen bg-slate-100 pb-10 text-black">
      <div className="mx-auto max-w-md overflow-hidden bg-white shadow-2xl">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-sky-700 px-4 pb-6 pt-5 text-white">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-400/30 blur-3xl" />
          <div className="absolute -left-14 bottom-10 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative z-10">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-cyan-200 shadow-lg ring-1 ring-white/20">
              🚘 Premium zaštita auta • 1+1 GRATIS
            </div>

            <h1 className="mt-4 text-center text-3xl font-black leading-tight">
              Ne ulazi više u užaren auto
            </h1>

            <p className="mt-2 text-center text-sm font-semibold text-sky-100">
              Auto kišobran koji čuva enterijer, smanjuje vrućinu i štiti vozilo od sunca
            </p>

            <div className="mt-4 rounded-[30px] bg-white p-3 shadow-2xl">
              <img
                src="https://i.imgur.com/CcVTxn2.png"
                alt="Auto kišobran"
                className="w-full rounded-2xl object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-3 text-center shadow-lg ring-1 ring-white/20">
                <div className="text-[11px] font-black uppercase tracking-wide text-sky-200">
                  Redovno
                </div>
                <div className="mt-1 text-xl font-black line-through">30,00 KM</div>
                <div className="text-xs font-semibold text-sky-100">za 1 komad</div>
              </div>

              <div className="rounded-2xl bg-cyan-300 p-3 text-center text-slate-950 shadow-lg">
                <div className="text-[11px] font-black uppercase tracking-wide">
                  Akcija
                </div>
                <div className="mt-1 text-2xl font-black">17,90 KM</div>
                <div className="text-xs font-black">1+1 GRATIS</div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToOrder}
              className="mt-4 w-full rounded-2xl bg-white px-5 py-4 text-base font-black uppercase tracking-wide text-slate-950 shadow-xl"
            >
              Naruči 2 komada
            </button>
          </div>
        </section>

        <main className="px-4 py-5">
          <section className="rounded-3xl bg-slate-950 p-5 text-white shadow-sm">
            <h2 className="text-xl font-black text-cyan-300">
              ☀️ Sunce ti svaki dan uništava auto
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Vreli volan, užarena sjedišta, izblijedjela plastika i pregrijan ekran nisu samo
              nerviranje – to vremenom oštećuje enterijer. Ovaj auto kišobran pravi zaštitnu barijeru
              odmah iza vjetrobranskog stakla.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
            <h2 className="text-xl font-black">✅ Šta dobijaš s njim?</h2>
            <div className="mt-4 space-y-3">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sm font-semibold text-slate-800"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-sky-100">
            <img
              src="https://i.imgur.com/BvXafcv.png"
              alt="Prije i poslije"
              className="w-full rounded-2xl object-cover"
            />
          </section>

          <section className="mt-5 rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-slate-950">
              🎁 1+1 GRATIS – praktično za dva auta
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-700">
              Jedan ostavi sebi, drugi za suprugu, roditelje ili drugi auto.
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-sky-100">
            <img
              src="https://i.imgur.com/sCb6XaT.jpeg"
              alt="Automehaničar"
              className="w-full rounded-2xl object-cover"
            />
            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <h2 className="text-lg font-black">🧑‍🔧 Savjet automehaničara</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                “Najveća šteta od sunca vidi se na plastici, sjedištima i elektronici. Ovakva zaštita
                je jednostavna, jeftina i produžava život enterijera. Najbolje je što se postavi za par sekundi.”
              </p>
              <p className="mt-2 text-sm font-black text-sky-700">
                — Marko Petrović, automehaničar
              </p>
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sky-100">
            <h2 className="text-xl font-black">💬 Vozači kažu</h2>
            <div className="mt-4 space-y-3">
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm leading-6 text-slate-700">“{item}”</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-sky-200 bg-sky-50 p-5">
            <h2 className="text-xl font-black">📦 Detalji proizvoda</h2>
            <div className="mt-4 space-y-2">
              {details.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white p-3 text-sm font-semibold text-slate-800 shadow-sm"
                >
                  ✔ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-red-800">
              ⏳ Akcija traje dok ima zaliha
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-700">
              1+1 GRATIS za 17,90 KM je trenutna ponuda.
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-sky-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Najčešća pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                  <h3 className="text-sm font-black text-sky-800">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            ref={orderRef}
            className="mt-5 rounded-3xl bg-gradient-to-b from-slate-950 to-blue-950 p-5 text-white shadow-2xl"
          >
            <div className="mb-3 rounded-2xl bg-cyan-300 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-slate-950 shadow-lg">
              🚘 Auto kišobran 1+1 gratis
            </div>

            <h2 className="text-center text-2xl font-black">📋 Naruči odmah</h2>
            <p className="mt-2 text-center text-sm text-sky-100">
              Plaćanje prilikom preuzimanja
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                name="ime"
                autoComplete="off"
                placeholder="Ime i prezime"
                className="w-full rounded-2xl border-2 border-cyan-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="telefon"
                autoComplete="off"
                placeholder="Broj telefona"
                className="w-full rounded-2xl border-2 border-cyan-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="adresa"
                autoComplete="off"
                placeholder="Adresa i mjesto"
                className="w-full rounded-2xl border-2 border-cyan-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="postanski"
                autoComplete="off"
                placeholder="Poštanski broj"
                className="w-full rounded-2xl border-2 border-cyan-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />

              <label className="flex gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-black">
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

              <div className="rounded-2xl border-2 border-cyan-300 bg-white p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>Auto kišobran 1+1 gratis</span>
                  <span>17,90 KM</span>
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
                className="w-full rounded-2xl bg-cyan-300 p-4 text-lg font-black uppercase tracking-wide text-slate-950 shadow-lg disabled:opacity-70"
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