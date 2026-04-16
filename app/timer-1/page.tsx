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

  const baseTotal = 69.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const benefits = [
    "Siječe i najdeblju travu bez zapinjanja",
    "2 baterije – radiš bez prekida",
    "Sve dobiješ u jednom paketu – nema dodatnih troškova",
    "Siguran rad uz rukavice i zaštitne naočale",
    "Uredi dvorište za par minuta",
  ];

  const packageItems = [
    "Aku trimer visoke snage",
    "2 jake baterije",
    "2 metalna noža za gustu travu",
    "20 plastičnih noževa za precizan rad",
    "Cirkular za jače rezanje",
    "Gratis rukavice",
    "Gratis zaštitne naočale",
    "3 godine garancije",
  ];

  const testimonials = [
    "Uzeo sam zbog seta – nisam morao ništa dodatno kupovati. Radi odlično.",
    "Iskreno, nisam očekivao ovu snagu. Reže sve bez problema.",
    "Najbolja stvar što nema kablova – samo uzmem i završim posao za čas.",
  ];

  const faqs = [
    {
      q: "Šta dolazi u setu?",
      a: "Dobijate aku trimer, 2 baterije, 2 metalna noža, 20 plastičnih noževa, cirkular, gratis rukavice i zaštitne naočale.",
    },
    {
      q: "Da li radi bez kabla?",
      a: "Da. Radi na baterije, tako da nema kablova, benzina ni komplikacija.",
    },
    {
      q: "Može li sjeći gustu travu?",
      a: "Da. Uz metalne noževe i jaku snagu bez problema prolazi kroz gustu travu i zapuštene dijelove dvorišta.",
    },
    {
      q: "Koliko traje baterija?",
      a: "Dovoljno za ozbiljan rad, a pošto dobijate 2 baterije možete raditi bez prekida.",
    },
    {
      q: "Ima li garanciju?",
      a: "Da, set dolazi sa garancijom od 3 godine.",
    },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const order = {
      product_name: "Makita aku trimer set",
      full_name: String(formData.get("ime") || ""),
      phone: String(formData.get("telefon") || ""),
      address_place: String(formData.get("adresa") || ""),
      postal_code: String(formData.get("postanski") || ""),
      gift_pack: giftPack,
      shipping: 10,
      product_price: 59.9,
      total: Number(total.toFixed(2)),
      status: "novo",
      source: "trimer",
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
      <div className="mx-auto max-w-md bg-white shadow-2xl">
        <section className="bg-gradient-to-b from-green-800 via-green-700 to-green-600 px-4 pb-5 pt-4 text-white">
          <div className="mb-3 flex justify-center">
            <img
              src="https://i.imgur.com/zBco9y4.png"
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="rounded-2xl bg-yellow-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-black shadow-lg">
            ✅ 3 GODINE GARANCIJE
          </div>

          <h1 className="mt-4 text-center text-2xl font-black leading-tight">
            🔥 RIJEŠI ZARASLO DVORIŠTE ZA 10 MINUTA
          </h1>

          <p className="mt-2 text-center text-sm font-semibold text-green-50">
            Bez kablova, bez muke i bez skupih alata
          </p>

          <div className="mt-4 rounded-3xl bg-white p-3 shadow-2xl">
            <img
              src="https://i.imgur.com/AQ7TANg.jpeg"
              alt="Makita aku trimer set"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-red-600 p-3 text-center shadow-lg">
              <div className="text-[11px] font-bold uppercase tracking-wide text-red-100">
                Redovna cijena
              </div>
              <div className="mt-1 text-xl font-black line-through">199,00 KM</div>
            </div>

            <div className="rounded-2xl bg-yellow-400 p-3 text-center text-black shadow-lg ring-2 ring-white/40">
              <div className="text-[11px] font-bold uppercase tracking-wide">Akcija</div>
              <div className="mt-1 text-2xl font-black">59,90 KM</div>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToOrder}
            className="mt-4 block w-full rounded-2xl bg-yellow-400 px-5 py-4 text-center text-base font-black uppercase tracking-wide text-black shadow-xl"
          >
            Naruči odmah
          </button>
        </section>

        <main className="px-4 py-5">
          <section className="rounded-3xl border border-red-200 bg-red-50 p-4">
            <h2 className="text-base font-black text-red-700">❌ Poznato ti je ovo?</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Trava naraste za par dana i dvorište izgleda zapušteno. Stari trimer slabo siječe
              ili stalno zapinje. Kablovi smetaju, benzin smrdi, a posao traje satima. Na kraju
              izgubiš živce… i opet nisi zadovoljan.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <div className="mb-3 rounded-2xl bg-yellow-100 px-4 py-3 text-center text-sm font-black text-black ring-1 ring-yellow-300">
              🔒 GARANCIJA 3 GODINE
            </div>

            <h2 className="text-xl font-black">✅ Zašto ljudi uzimaju ovaj set?</h2>
            <div className="mt-4 space-y-3">
              {benefits.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ⚡ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-5">
            <h2 className="text-xl font-black">💡 Rješenje koje stvarno radi</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-700">
              Makita Aku Trimer set je napravljen da riješi sve te probleme odmah. Bez kablova.
              Bez benzina. Bez komplikacije. Samo uzmeš u ruke i kreneš.
            </p>
          </section>

          <section className="mt-5 rounded-3xl border border-green-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">📦 Šta dobijaš u setu?</h2>
            <div className="mt-4 space-y-2">
              {packageItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-green-50 p-3 text-sm font-semibold text-neutral-800 shadow-sm"
                >
                  ✔ {item}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm font-black text-green-700">
              👉 Sve u jednom – spreman za rad odmah
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <h2 className="text-xl font-black">💪 Zašto je ovaj trimer drugačiji?</h2>

            <div className="mt-4 rounded-2xl bg-green-50 p-4">
              <h3 className="text-sm font-black text-green-800">⚡ Snaga koja reže bez milosti</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                Metalni noževi prolaze kroz gustu travu bez problema. Nema više zapinjanja ni
                gubljenja vremena.
              </p>
            </div>

            <div className="mt-3 rounded-2xl bg-green-50 p-4">
              <h3 className="text-sm font-black text-green-800">🔋 Bez kablova – potpuna sloboda</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                Radi gdje god hoćeš. Dvorište, voćnjak, vikendica – bez ograničenja.
              </p>
            </div>

            <div className="mt-3 rounded-2xl bg-green-50 p-4">
              <h3 className="text-sm font-black text-green-800">⏱️ Brzina koja štedi vrijeme</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                Ono što si radio satima, sada završiš za 10–15 minuta.
              </p>
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <h2 className="text-xl font-black">⭐ Šta kažu ljudi?</h2>
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
              🛡️ 3 GODINE GARANCIJE – BEZ RIZIKA
            </div>
            <div className="mt-1 text-xs font-semibold text-neutral-700">
              Kupuješ potpuno sigurno. Ako nešto ne bude kako treba – pokriven si.
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-neutral-900">⏳ Akcija je ograničena</div>
            <div className="mt-1 text-xs font-semibold text-neutral-700">
              Zbog velike potražnje količine su ograničene. Kada se rasproda – čeka se nova tura.
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-green-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-black">❓ Najčešća pitanja</h2>
            <div className="mt-4 space-y-3">
              {faqs.map((item) => (
                <div key={item.q} className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <h3 className="text-sm font-black text-green-800">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="narudzba"
            className="mt-5 rounded-3xl bg-gradient-to-b from-green-700 to-green-600 p-5 text-white shadow-2xl"
          >
            <div className="mb-3 rounded-2xl bg-yellow-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-black shadow-lg">
              ✅ GARANCIJA 3 GODINE
            </div>

            <h2 className="text-center text-2xl font-black">📝 Ostavi podatke i osiguraj svoj set</h2>
            <p className="mt-2 text-center text-sm text-green-100">
              Jednostavno, brzo i bez komplikacija
            </p>

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

              <div className="rounded-2xl border-2 border-green-500 bg-white p-4 text-black">
                <div className="flex justify-between text-sm">
                  <span>Makita Aku Trimer set</span>
                  <span>59,90 KM</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Dostava</span>
                  <span>10,00 KM</span>
                </div>
                {giftPack && (
                  <div className="mt-1 flex justify-between text-sm text-green-700">
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