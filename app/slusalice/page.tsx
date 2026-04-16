"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export default function Page() {
  const [giftPack, setGiftPack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    const forceTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    forceTop();

    const t1 = setTimeout(forceTop, 50);
    const t2 = setTimeout(forceTop, 150);
    const t3 = setTimeout(() => {
      forceTop();
      setPageReady(true);
    }, 300);
    const t4 = setTimeout(forceTop, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const scrollToOrder = () => {
    const el = document.getElementById("narudzba");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const baseTotal = 39.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const features = [
    "Active Noise Cancellation (ANC) – blokira buku oko tebe",
    "Kristalno čist i snažan zvuk",
    "Bežično povezivanje za par sekundi",
    "Mikrofon za jasne pozive",
    "Touch kontrola – upravljaj dodirom",
    "Baterija koja traje satima",
    "Brzo punjenje u kutiji",
  ];

  const audience = [
    "Ako te nervira buka dok slušaš muziku",
    "Ako često pričaš na telefon u pokretu",
    "Ako želiš slobodu bez kablova",
    "Ako treniraš ili se krećeš svaki dan",
    "Ako želiš poklon koji sigurno oduševljava",
  ];

  const testimonials = [
    "Bukvalno ne čujem okolinu kad ih stavim – top! — Almir T., Lukavac",
    "Za ove pare ANC? Nisam vjerovao dok nisam probao. — Goran M., Banja Luka",
    "Koristim ih svaki dan na poslu i u autu – prezadovoljan. — Edin S., Sarajevo",
    "Male, lagane i praktične. Zvuk čist, baterija odlična. — Senad B., Živinice",
    "Kupio iz znatiželje – sad ih ne skidam. — Nenad K., Bijeljina",
    "Odlične za pozive, svi me jasno čuju. — Adnan H., Visoko",
    "Poklon koji je oduševio! — Emir S., Mostar",
  ];

  const packageItems = [
    "AirPods 4 slušalice",
    "Kutija za punjenje",
    "Kabl za punjenje",
    "Bluetooth povezivanje za Android i iOS",
    "ANC funkcija",
    "3 godine garancije",
  ];

  const faqs = [
    {
      q: "Šta dolazi u paketu?",
      a: "Dobijate slušalice, kutiju za punjenje i kabl.",
    },
    {
      q: "Da li rade na svim telefonima?",
      a: "Da, kompatibilne su sa Android i iOS uređajima.",
    },
    {
      q: "Da li stvarno imaju ANC?",
      a: "Da. ANC funkcija smanjuje buku iz okoline i poboljšava doživljaj zvuka.",
    },
    {
      q: "Koliko traje baterija?",
      a: "Nekoliko sati aktivnog korištenja, uz dodatno punjenje u kutiji.",
    },
    {
      q: "Jesu li udobne za nošenje?",
      a: "Da, lagane su i ergonomski dizajnirane za duže nošenje.",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "AirPods 4 slušalice",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 29.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "airpods-4",
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

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }

  return (
    <div
      className={`min-h-screen bg-neutral-100 pb-10 text-black transition-opacity duration-200 ${
        pageReady ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="mx-auto max-w-md overflow-hidden bg-white shadow-2xl">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-zinc-900 px-4 pb-6 pt-5 text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-400 blur-3xl" />
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-violet-500 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-cyan-200 shadow-lg backdrop-blur">
              ❗ 3 GODINE GARANCIJA – BEZ RIZIKA
            </div>

            <h1 className="mt-4 text-center text-2xl font-black leading-tight">
              🎧 AIRPODS 4 SLUŠALICE – ZABORAVI BUKU, UŽIVAJ U ZVUKU
            </h1>

            <p className="mt-2 text-center text-sm font-semibold text-zinc-200">
              Bežične slušalice sa Active Noise Cancellation (ANC) – čuj samo ono što želiš
            </p>

            <div className="mt-4 rounded-[28px] border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
              <img
                src="https://i.imgur.com/HXTKhvz.png"
                alt="AirPods 4"
                className="w-full rounded-2xl object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-3 text-center shadow-lg backdrop-blur">
                <div className="text-[11px] font-bold uppercase tracking-wide text-zinc-300">
                  Redovna cijena
                </div>
                <div className="mt-1 text-xl font-black line-through">79,90 KM</div>
              </div>

              <div className="rounded-2xl bg-cyan-400 p-3 text-center text-black shadow-lg ring-2 ring-white/20">
                <div className="text-[11px] font-bold uppercase tracking-wide">Danas</div>
                <div className="mt-1 text-2xl font-black">29,90 KM</div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToOrder}
              className="mt-4 block w-full rounded-2xl bg-white px-5 py-4 text-center text-base font-black uppercase tracking-wide text-black shadow-xl"
            >
              Naruči odmah
            </button>
          </div>
        </section>

        <main className="px-4 py-5">
          <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
            <h2 className="text-base font-black text-cyan-800">
              🎵 Sve što ti treba u jednom proizvodu
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Zamisli da možeš slušati muziku, pričati na telefon ili gledati video bez buke oko
              sebe. Nema više kablova, nema prekidanja veze, nema lošeg zvuka. Samo čist, jak i
              stabilan audio – gdje god da si.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-cyan-100">
            <div className="mb-3 rounded-2xl bg-cyan-100 px-4 py-3 text-center text-sm font-black text-cyan-900 ring-1 ring-cyan-200">
              🔇 ANC + 3 GODINE GARANCIJA
            </div>

            <h2 className="text-xl font-black">✅ Glavne prednosti</h2>
            <div className="mt-4 space-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ✅ {feature}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-cyan-100">
            <img
              src="https://i.imgur.com/VfkPSP0.png"
              alt="Realan prikaz AirPods 4"
              className="w-full rounded-2xl object-cover"
            />
          </section>

          <section className="mt-5 rounded-3xl bg-zinc-50 p-5 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-xl font-black">💥 Za koga je ovo?</h2>
            <div className="mt-4 space-y-3">
              {audience.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white p-3 text-sm font-semibold text-neutral-800 shadow-sm ring-1 ring-zinc-100"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-cyan-100">
            <img
              src="https://i.imgur.com/2PWFZdA.jpeg"
              alt="Stručnjak"
              className="w-full rounded-2xl object-cover"
            />
            <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
              <h2 className="text-lg font-black">🧑‍🔧 Izjava stručnjaka</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                “Kao neko ko svakodnevno koristi bežične slušalice, mogu reći da je ANC funkcija
                ovdje ogromna prednost. Zvuk je čist, nema prekida i povezivanje je brzo. Za ovu
                cijenu – teško naći bolje.”
              </p>
              <p className="mt-2 text-sm font-black text-cyan-700">
                — Amir K., IT tehničar, Tuzla
              </p>
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-cyan-100">
            <h2 className="text-xl font-black">💬 Šta kažu naši kupci?</h2>
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

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-cyan-100">
            <img
              src="https://i.imgur.com/a6HELRR.png"
              alt="Detalji proizvoda"
              className="w-full rounded-2xl object-cover"
            />
          </section>

          <section className="mt-5 rounded-3xl border border-cyan-200 bg-cyan-50 p-5">
            <h2 className="text-xl font-black">📦 Detalji proizvoda</h2>
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

            <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-cyan-800 ring-1 ring-cyan-200">
              ✅ 3 GODINE GARANCIJA
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-yellow-300 bg-yellow-100 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-neutral-900">
              🚨 OGRANIČENA AKCIJA
            </div>
            <div className="mt-1 text-xs font-semibold text-neutral-700">
              Zbog velike potražnje količine su ograničene. Naruči danas dok je cijena 29,90 KM.
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-cyan-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Najčešća pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                  <h3 className="text-sm font-black text-cyan-800">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="narudzba"
            className="mt-5 rounded-3xl bg-gradient-to-b from-slate-900 to-zinc-900 p-5 text-white shadow-2xl"
          >
            <div className="mb-3 rounded-2xl bg-cyan-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-black shadow-lg">
              ✅ 3 GODINE GARANCIJA
            </div>

            <h2 className="text-center text-2xl font-black">📋 Naruči odmah</h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                name="ime"
                placeholder="Ime i prezime"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="telefon"
                placeholder="Broj telefona"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="adresa"
                placeholder="Adresa i mjesto"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="postanski"
                placeholder="Poštanski broj"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
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
                  <div className="text-xs">+5,00 KM (vrijednost do 20,00 KM)</div>
                </div>
              </label>

              <div className="rounded-2xl border-2 border-cyan-400 bg-white p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>AirPods 4</span>
                  <span>29,90 KM</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Poštarina</span>
                  <span>10,00 KM</span>
                </div>
                {giftPack && (
                  <div className="mt-1 flex justify-between text-sm text-cyan-700">
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
                className="w-full rounded-2xl bg-cyan-400 p-4 text-lg font-black uppercase tracking-wide text-black shadow-lg disabled:opacity-70"
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