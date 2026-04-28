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
    const originalOverflow = document.body.style.overflow;

    const forceTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    document.body.style.overflow = "hidden";

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
      document.body.style.overflow = originalOverflow || "auto";
    }, 450);
    const t4 = setTimeout(forceTop, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const scrollToOrder = () => {
    const el = document.getElementById("narudzba");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const baseTotal = 189.9;
  const total = useMemo(() => (giftPack ? baseTotal + 5 : baseTotal), [giftPack]);

  const features = [
    "Udarni odvijač",
    "Aku udarna bušilica",
    "Brusilica",
    "SDS hilti bušilica",
    "4 jake baterije",
    "1 brzi punjač",
    "Čvrsti kofer",
  ];

  const audience = [
    "Domaćine koji žele sami uraditi stvari",
    "Majstore i zanatlije kojima alat mora biti uvijek spreman",
    "Ljude koji uređuju kuću, stan ili radionicu",
    "Sve koji žele moćan alat bez da potroše bogatstvo",
  ];

  const testimonials = [
    "Odavno nisam ovako dobru kupovinu napravio. Set radi top, koristim ga svaki dan! — Almir T., Lukavac",
    "Napravio sam radionicu, ovaj Makita set mi je prva stvar koju sam kupio. Sve imam u njemu. — Goran M., Banja Luka",
    "Brusilica mi je najviše koristila, ali i bušilica i hilti su odlični – sve u jednom setu, to mi je trebalo. — Edin S., Sarajevo",
    "Radim sitne popravke i montaže po kućama – nosim ovaj set sa sobom i nemam potrebe za drugim alatom. — Senad B., Živinice",
    "U početku sam bio skeptičan zbog cijene, ali sad bih platio i više – alat je čudo! — Nenad K., Bijeljina",
    "Punjač puni brzo, baterije drže dobro – nema više čekanja ni razvlačenja kablova. — Adnan H., Visoko",
    "Poklonio sam ga ocu za rođendan – kaže da mu je to najbolji poklon u zadnjih 10 godina. — Emir S., Mostar",
  ];

  const packageItems = [
    "Udarni odvijač",
    "Aku udarna bušilica",
    "Brusilica",
    "SDS hilti bušilica",
    "4 punjive baterije",
    "Brzi punjač",
    "Tvrdi plastični kofer",
    "3 godine garancije",
  ];

  const faqs = [
    {
      q: "Šta dolazi u paketu?",
      a: "Dobijate 4 alata: udarni odvijač, brusilicu, aku bušilicu i SDS hilti, plus 4 baterije, brzi punjač i čvrsti kofer.",
    },
    {
      q: "Je li original Makita?",
      a: "Alat je u Makita stilu i radi na Makita baterije, pogodan za majstore i hobi upotrebu.",
    },
    {
      q: "Koliko traju baterije?",
      a: "Dovoljno za više sati rada, brzo se pune i lako mijenjaju.",
    },
    {
      q: "Može li se koristiti za beton?",
      a: "Da. SDS hilti u setu je namijenjen za bušenje betona, zida i pločica.",
    },
    {
      q: "Je li bučan?",
      a: "Radi kao i svaki profesionalni alat – moćno i efikasno, ali nije preglasan.",
    },
  ];

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
              src="https://i.imgur.com/lSbB2fv.png"
              alt="Makita logo"
              className="h-10 w-auto object-contain"
            />
          </div>

          <div className="rounded-2xl bg-yellow-400 px-4 py-3 text-center text-sm font-black uppercase tracking-wide text-black shadow-lg">
            ✅ 3 GODINE GARANCIJA
          </div>

          <h1 className="mt-4 text-center text-2xl font-black leading-tight">
            🔧 MAKITA 4u1 AKU SET – AKCIJA KOJU NE SMIJEŠ PROPUSTITI
          </h1>

          <p className="mt-2 text-center text-sm font-semibold text-green-50">
            4 moćna uređaja + 4 baterije + brzi punjač – sve u jednom čvrstom koferu
          </p>

          <div className="mt-4 rounded-3xl bg-white p-3 shadow-2xl">
            <img
              src="https://i.imgur.com/Rt922x2.png"
              alt="Makita 4u1 set"
              className="w-full rounded-2xl object-cover"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-red-600 p-3 text-center shadow-lg">
              <div className="text-[11px] font-bold uppercase tracking-wide text-red-100">
                Redovna cijena
              </div>
              <div className="mt-1 text-xl font-black line-through">499,00 KM</div>
            </div>

            <div className="rounded-2xl bg-yellow-400 p-3 text-center text-black shadow-lg ring-2 ring-white/40">
              <div className="text-[11px] font-bold uppercase tracking-wide">Akcija</div>
              <div className="mt-1 text-2xl font-black">179,90 KM</div>
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
            <h2 className="text-base font-black text-red-700">
              ❌ Prestanite kupovati odvojeno alat koji vam stalno fali
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Nema više razbacanih alata, slabih baterija ili nedostatka snage. Sve što vam treba
              dolazi u jednom profi koferu – spremno za kuću, radionicu i teren.
            </p>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
            <div className="mb-3 rounded-2xl bg-yellow-100 px-4 py-3 text-center text-sm font-black text-black ring-1 ring-yellow-300">
              🛡️ 3 GODINE GARANCIJE
            </div>

            <h2 className="text-xl font-black">🛠️ Sve što ti treba u jednom setu</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Makita 4u1 set je savršen za svakog domaćina, majstora ili hobi entuzijastu. Poslovi
              koji su tražili više različitih alata sada su riješeni jednim kompletom.
            </p>

            <div className="mt-4 space-y-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-green-200 bg-green-50 p-3 text-sm font-semibold text-neutral-800"
                >
                  ✅ {feature}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-green-100">
            <img
              src="https://i.imgur.com/oPyfDvA.png"
              alt="Realan prikaz Makita seta"
              className="w-full rounded-2xl object-cover"
            />
          </section>

          <section className="mt-5 rounded-3xl bg-green-50 p-5 shadow-sm ring-1 ring-green-200">
            <h2 className="text-xl font-black">💥 Za koga je ovo?</h2>
            <div className="mt-4 space-y-3">
              {audience.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white p-3 text-sm font-semibold text-neutral-800 shadow-sm"
                >
                  ✅ {item}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-green-100">
            <img
              src="https://i.imgur.com/2juafrt.jpeg"
              alt="Stručnjak"
              className="w-full rounded-2xl object-cover"
            />
            <div className="mt-4 rounded-2xl bg-neutral-50 p-4">
              <h2 className="text-lg font-black">🧑‍🔧 Izjava stručnjaka</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700">
                “Kao dugogodišnji električar i majstor, mogu reći da je ovaj set više nego
                isplativ. Imate 4 alata koji rade odlično, baterije traju, a sve dođe spakovano u
                čvrstom koferu. Po ovoj cijeni – ne razmišljajte!”
              </p>
              <p className="mt-2 text-sm font-black text-green-700">
                — Nedžad M., elektroinstalater, Tuzla
              </p>
            </div>
          </section>

          <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-green-100">
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

          <section className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-5">
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

            <div className="mt-4 rounded-2xl bg-yellow-100 px-4 py-3 text-center text-sm font-black text-black ring-1 ring-yellow-300">
              ✅ GARANCIJA 3 GODINE
            </div>
          </section>

          <section className="mt-5 rounded-3xl border border-yellow-300 bg-yellow-100 p-4 text-center shadow-sm">
            <div className="text-sm font-black text-neutral-900">
              🔥 Ograničena količina • 3 GODINE GARANCIJA
            </div>
            <div className="mt-1 text-xs font-semibold text-neutral-700">
              Sigurna kupovina i brza dostava na kućnu adresu.
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
              ✅ 3 GODINE GARANCIJA
            </div>

            <h2 className="text-center text-2xl font-black">📋 Naruči odmah</h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <input
                name="ime"
                autoComplete="off"
                placeholder="Ime i prezime"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="telefon"
                autoComplete="off"
                placeholder="Broj telefona"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="adresa"
                autoComplete="off"
                placeholder="Adresa i mjesto"
                className="w-full rounded-2xl border-2 border-gray-300 bg-white p-4 text-black outline-none placeholder:text-neutral-500"
              />
              <input
                name="postanski"
                autoComplete="off"
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
                  <span>Set 4u1</span>
                  <span>179,90 KM</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span>Poštarina</span>
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