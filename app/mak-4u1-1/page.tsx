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

  const baseTotal = 189.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const benefits = [
    "4 profesionalna aku alata u jednom setu",
    "Aku udarni odvijač – vijci bez napora za sekundu",
    "Aku kutna brusilica – rezanje i brušenje na bateriju",
    "Aku SDS bušilica – beton, cigla, kamen bez kabla",
    "Aku bušilica – drvo, metal i plastika gdje god trebaš",
    "4x baterije 128V – radiš dugo bez prekida",
    "Brzi punjač – baterija puna za kratko vrijeme",
    "Tvrdi kofer za transport i čuvanje alata",
    "3 godine garancije na sve alate",
  ];

  const details = [
    "Udarni odvijač – 180 Nm okretni moment",
    "Kutna brusilica – disk 115 mm",
    "SDS bušilica – udar + rotacija za tvrde materijale",
    "Bušilica – regulacija brzine, obrtni smjer",
    "4x baterija 128V Li-Ion",
    "Brzi punjač u kompletu",
    "Tvrdi kofer otporan na udarce",
    "Garancija: 3 godine",
  ];

  const testimonials = [
    "Koristim na gradilištu svaki dan, baterije traju jako dugo. Kofer je bonus – sve na jednom mjestu. — Nermin B., Sarajevo",
    "Kupio za vikendicu, sve sam sam uradio. SDS bušilica je fenomenalna za beton. — Zoran K., Banja Luka",
    "Radio sam kompletnu renovaciju stana ovim setom. Vrijednost za novac je odlična. — Emir T., Tuzla",
    "Dosta mi je kablova svuda po radionici. Ove baterije traju, nema stajanja. — Branko M., Mostar",
    "3 godine garancije je ono što me odlučilo. Pravi alat, ne igračka. — Adis H., Zenica",
    "Kofer je masivan i stabilan. Poklonio sam ocu, prezadovoljan je. — Damir Š., Bihać",
  ];

  const faqs = [
    {
      q: "Šta je sve uključeno u set?",
      a: "Aku udarni odvijač, aku kutna brusilica, aku SDS bušilica, aku bušilica, 4 baterije 128V, brzi punjač i tvrdi kofer za transport.",
    },
    {
      q: "Koliko traje baterija?",
      a: "Baterije 128V Li-Ion dizajnirane su za duže korištenje. Uz brzi punjač, rade te možeš odmah nastaviti rad.",
    },
    {
      q: "Može li SDS bušilica bušiti beton?",
      a: "Da. SDS bušilica ima udarne i rotacijske funkcije i namijenjena je upravo za beton, ciglu i kamen.",
    },
    {
      q: "Kakva je garancija?",
      a: "Na sve alate u setu dolazi 3 godine garancije.",
    },
    {
      q: "Kako se plaća?",
      a: "Plaćanje je pouzećem – platiš tek kada preuzmeš paket na kućnu adresu.",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "Makita aku set 4u1 – udarni odvijač, brusilica, SDS bušilica, bušilica",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 179.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "makita-4u1",
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

        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-green-950 to-green-800 px-4 pb-6 pt-5 text-white">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-green-400/30 blur-3xl" />
          <div className="absolute -left-14 bottom-10 h-44 w-44 rounded-full bg-lime-300/20 blur-3xl" />

          <div className="relative z-10">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-green-200 shadow-lg ring-1 ring-white/20">
              🔧 Profesionalni aku set • 4 alata u 1 koferu
            </div>

            <h1 className="mt-4 text-center text-3xl font-black leading-tight">
              Makita 4u1 – sve što ti treba, bez kabla
            </h1>

            <p className="mt-2 text-center text-sm font-semibold text-green-100">
              Udarni odvijač, brusilica, SDS bušilica i bušilica – 4 baterije + brzi punjač + tvrdi kofer
            </p>

            <div className="mt-4 rounded-[30px] bg-white p-3 shadow-2xl">
              <img
                src="https://i.imgur.com/zq6UeUi.jpeg"
                alt="Makita aku set 4u1"
                className="w-full rounded-2xl object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-3 text-center shadow-lg ring-1 ring-white/20">
                <div className="text-[11px] font-black uppercase tracking-wide text-green-200">
                  Vrijednost seta
                </div>
                <div className="mt-1 text-xl font-black line-through">300,00 KM</div>
                <div className="text-xs font-semibold text-green-100">4 alata odvojeno</div>
              </div>

              <div className="rounded-2xl bg-green-400 p-3 text-center text-slate-950 shadow-lg">
                <div className="text-[11px] font-black uppercase tracking-wide">
                  Akcijska cijena
                </div>
                <div className="mt-1 text-2xl font-black">179,90 KM</div>
                <div className="text-xs font-black">+ 3 god. garancija</div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToOrder}
              className="mt-4 w-full rounded-2xl bg-white px-5 py-4 text-base font-black uppercase tracking-wide text-slate-950 shadow-xl"
            >
              Naruči set odmah
            </button>
          </div>
        </section>

        <main className="px-4 py-5">

          {/* PROBLEM */}
          <section className="rounded-3xl bg-slate-950 p-5 text-white shadow-sm">
            <h2 className="text-xl font-black text-green-300">
              🔌 Dosta kablova i posuđivanja alata
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              Svaki put kad trebaš bušiti, odvrtati ili brusiti – tražiš produžni kabel, tražiš slobodnu utičnicu ili posuđuješ alat od komšije. Ovaj set ti daje slobodu da radiš gdje hoćeš, bez kabla i bez kompromisa.
            </p>
          </section>

          {/* BENEFITS */}
          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <h2 className="text-xl font-black">✅ Šta je sve u setu?</h2>
            <div className="mt-4 space-y-3">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-slate-800"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          {/* GARANCIJA BANER */}
          <section className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-slate-950">
              🛡️ 3 GODINE GARANCIJE na sve alate u setu
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-700">
              Kupuješ sa sigurnošću – Makita standard kvalitete.
            </div>
          </section>

          {/* EXPERT QUOTE */}
          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-green-100">
            <div className="rounded-2xl bg-slate-50 p-4">
              <h2 className="text-lg font-black">👷 Mišljenje majstora</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                "Aku alati su budućnost radionice i gradilišta. Makita baterije su pouzdane,
                a kada u jednom koferu dobiješ četiri alata – to je stvarna ušteda i praktičnost.
                Preporučujem svakom ko ozbiljno radi."
              </p>
              <p className="mt-2 text-sm font-black text-green-700">
                — Haris Begić, majstor opće gradnje
              </p>
            </div>
          </section>

          {/* TESTIMONIALS */}
          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <h2 className="text-xl font-black">💬 Kupci kažu</h2>
            <div className="mt-4 space-y-3">
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm leading-6 text-slate-700">"{item}"</p>
                </div>
              ))}
            </div>
          </section>

          {/* DETAILS */}
          <section className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-5">
            <h2 className="text-xl font-black">📦 Tehnički detalji</h2>
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

          {/* URGENCY */}
          <section className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-red-800">
              ⏳ Ograničene zalihe – akcijska cijena dok traje stock
            </div>
            <div className="mt-1 text-xs font-semibold text-slate-700">
              179,90 KM za kompletan set je trenutna ponuda.
            </div>
          </section>

          {/* FAQ */}
          <section className="mt-5 rounded-3xl border border-green-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Najčešća pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <h3 className="text-sm font-black text-green-800">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ORDER FORM */}
          <section
            ref={orderRef}
            className="mt-5 rounded-3xl bg-gradient-to-b from-slate-950 to-green-950 p-5 text-white shadow-2xl"
          >
            <div className="mb-3 rounded-2xl bg-green-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-slate-950 shadow-lg">
              🔧 Makita aku set 4u1 – 3 god. garancija
            </div>

            <h2 className="text-center text-2xl font-black">📋 Naruči odmah</h2>
            <p className="mt-2 text-center text-sm text-green-100">
              Plaćanje prilikom preuzimanja
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                name="ime"
                autoComplete="off"
                placeholder="Ime i prezime"
                className="w-full rounded-2xl border-2 border-green-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="telefon"
                autoComplete="off"
                placeholder="Broj telefona"
                className="w-full rounded-2xl border-2 border-green-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="adresa"
                autoComplete="off"
                placeholder="Adresa i mjesto"
                className="w-full rounded-2xl border-2 border-green-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="postanski"
                autoComplete="off"
                placeholder="Poštanski broj"
                className="w-full rounded-2xl border-2 border-green-200 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />

              <label className="flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-3 text-black">
                <input
                  type="checkbox"
                  checked={giftPack}
                  onChange={(e) => setGiftPack(e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-bold">Želim poklon pakovanje</div>
                  <div className="text-xs">+5,00 KM</div>
                </div>
              </label>

              <div className="rounded-2xl border-2 border-green-300 bg-white p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>Makita aku set 4u1</span>
                  <span>179,90 KM</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Dostava</span>
                  <span>10,00 KM</span>
                </div>
                {giftPack && (
                  <div className="mt-1 flex justify-between text-sm text-green-700">
                    <span>Poklon pakovanje</span>
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
                className="w-full rounded-2xl bg-green-400 p-4 text-lg font-black uppercase tracking-wide text-slate-950 shadow-lg disabled:opacity-70"
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
